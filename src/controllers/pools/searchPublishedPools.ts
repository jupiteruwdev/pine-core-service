import BigNumber from 'bignumber.js'
import _ from 'lodash'
import { PipelineStage } from 'mongoose'
import appConf from '../../app.conf'
import { PoolModel } from '../../database'
import { Blockchain, Pool, Value } from '../../entities'
import fault from '../../utils/fault'
import { mapPool } from '../adapters'
import { getEthNFTMetadata } from '../collaterals'
import Tenor from '../utils/Tenor'
import getTokenUSDPrice, { AvailableToken } from '../utils/getTokenUSDPrice'

export enum PoolSortType {
  NAME = 'name',
  LTV = 'ltv',
  INTEREST = 'interest',
  UTILIZATION = 'utilization',
  TVL = 'tvl',
  BORROWING = 'borrowing'
}

export enum PoolSortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

type Params = {
  blockchainFilter?: Blockchain.Filter
  collectionAddress?: string
  address?: string
  collectionName?: string
  includeRetired?: boolean
  checkLimit?: boolean
  lenderAddress?: string
  tenors?: number[]
  nftId?: string
  poolVersion?: number
  paginateBy?: {
    count: number
    offset: number
  }
  sortBy?: {
    type: PoolSortType
    direction: PoolSortDirection
  }
  minorPools?: boolean
  convertToUSD?: boolean
  includeInvalidTenors?: boolean
}

export async function filterByNftId(blockchain: Blockchain, docs: any[], nftId: string): Promise<any[]> {
  try {
    if (docs.length) {
      if (_.isString(_.get(docs[0], 'collection.matcher.regex')) && _.isString(_.get(docs[0], 'collection.matcher.fieldPath'))) {
        const metadata = await getEthNFTMetadata({ blockchain, collectionAddress: docs[0].collection.address, nftId })
        const nftProps = { id: nftId, ...metadata }
        const subDocs = docs.filter(doc => {
          if (_.isString(_.get(doc, 'collection.matcher.regex')) && _.isString(_.get(doc, 'collection.matcher.fieldPath'))) {
            const regex = new RegExp(doc.collection.matcher.regex)
            if (regex.test(_.get(nftProps, doc.collection.matcher.fieldPath))) return true
            return false
          }
          return true
        })
        return subDocs.length ? subDocs : docs
      }
    }
    return docs
  }
  catch (err) {
    throw fault('ERR_SEARCH_PUBLISHED_POOLS_FILTER_BY_NFT_ID', undefined, err)
  }
}

async function searchPublishedPools({
  checkLimit,
  paginateBy,
  convertToUSD = true,
  includeInvalidTenors = true,
  ...params
}: Params): Promise<Pool[]> {
  try {
    const aggregation = PoolModel.aggregate(getPipelineStages({
      ...params,
    }))
    const blockchain = Blockchain.parseBlockchain(params.blockchainFilter ?? {})

    let docs
    if (params.nftId !== undefined) {
      docs = await aggregation.exec()
      const blockchain = Blockchain.parseBlockchain(params.blockchainFilter ?? {})
      docs = await filterByNftId(blockchain, docs, params.nftId)

      if (paginateBy !== undefined) {
        docs = docs.slice(paginateBy.offset, paginateBy.offset + paginateBy.count - 1)
      }
    }
    else {
      docs = paginateBy === undefined ? await aggregation.exec() : await aggregation.skip(paginateBy.offset).limit(paginateBy.count).exec()
    }

    let pools = docs.map(mapPool)

    if (convertToUSD) {
      const ethValueUSD = await getTokenUSDPrice(Blockchain.parseNativeToken(blockchain) as AvailableToken)

      pools = pools.map(pool => ({
        ...pool,
        valueLocked: Value.$USD(pool.valueLocked.amount.times(ethValueUSD.amount)),
        utilization: Value.$USD(pool.utilization.amount.times(ethValueUSD.amount)),
      }))
    }

    if (checkLimit) {
      return pools.filter(pool => !(!!pool.collection?.valuation?.value?.amount && pool.ethLimit !== 0 && pool.loanOptions.some(option => pool.utilization?.amount.plus(pool.collection?.valuation?.value?.amount ?? new BigNumber(0)).gt(new BigNumber(pool.ethLimit ?? 0)))))
    }

    if (includeInvalidTenors) return pools

    const filteredPools: Pool[] = []
    pools.forEach(pool => {
      const filteredLoanOptions = pool.loanOptions.filter(loanOption => appConf.tenors.find(tenor => Math.abs(Tenor.convertTenor(tenor) - loanOption.loanDurationSeconds) <= 1))
      if (filteredLoanOptions.length) {
        pool.loanOptions = filteredLoanOptions
        filteredPools.push(pool)
      }
    })

    return filteredPools.filter(pool => pool.valueLocked.amount.gt(pool.utilization.amount ?? '0'))
  }
  catch (err) {
    throw fault('ERR_SERACH_PUBLISHED_POOLS', undefined, err)
  }
}

export default searchPublishedPools

function getPipelineStages({
  blockchainFilter = {
    ethereum: Blockchain.Ethereum.Network.MAIN,
    solana: Blockchain.Solana.Network.MAINNET,
    polygon: Blockchain.Polygon.Network.MAIN,
    arbitrum: Blockchain.Arbitrum.Network.MAINNET,
    avalanche: Blockchain.Avalanche.Network.MAINNET,
  },
  collectionAddress,
  collectionName,
  includeRetired = false,
  lenderAddress,
  sortBy,
  address,
  tenors,
  poolVersion,
  minorPools = false,
}: Params): PipelineStage[] {
  try {
    const blockchains = Blockchain.fromFilter(blockchainFilter)

    const collectionFilter = [
      ...collectionAddress === undefined ? [] : [{
        'collection.address': {
          $regex: collectionAddress,
          $options: 'i',
        },
      }],
      ...collectionName === undefined ? [] : [{
        'collection.displayName': {
          $regex: `.*${collectionName}.*`,
          $options: 'i',
        },
      }],
    ]
    const poolFilter = [
      ...address === undefined ? [] : [{
        'address': {
          $regex: address,
          $options: 'i',
        },
      }],
      ...tenors === undefined ? [] : [{
        'loanOptions.loanDurationSecond': {
          $in: Tenor.convertTenors(tenors),
        },
      }],
      ...poolVersion === undefined ? [] : [{
        poolVersion,
      }],
    ]

    const stages: PipelineStage[] = [{
      $match: {
        ...blockchains?.length ? {
          '$or': blockchains.map(blockchain => ({
            $and: [
              { 'networkType': blockchain.network },
              { 'networkId': blockchain.networkId },
            ],
          })) } : {},
        ...lenderAddress === undefined ? {} : { lenderAddress },
        ...includeRetired === true ? {} : { retired: { $ne: true } },
      },
    }, {
      $lookup: {
        from: 'nftCollections',
        localField: 'nftCollection',
        foreignField: '_id',
        as: 'collection',
      },
    }, {
      $unwind: '$collection',
    },
    ...collectionFilter.length === 0 ? [] : [{
      $match: { $and: collectionFilter },
    }],
    ...poolFilter.length === 0 ? [] : [{
      $match: { $and: poolFilter },
    }], {
      $addFields: {
        name: {
          $toLower: {
            $trim: {
              input: '$collection.displayName',
              chars: '"',
            },
          },
        },
        interest: {
          $min: '$loanOptions.interestBpsBlock',
        },
        interestOverride: {
          $min: '$loanOptions.interestBpsBlockOverride',
        },
        maxLTV: {
          $max: '$loanOptions.maxLtvBps',
        },
      },
    }, {
      $addFields: {
        lowestAPR: {
          $cond: {
            if: {
              $ne: ['$interestOverride', null],
            },
            then: '$interestOverride',
            else: '$interest',
          },
        },
      },
    },
    {
      $match: {
        'valueLockedEth': {
          $gte: minorPools ? 0 : 0.01,
        },
      },
    },
    ]

    switch (sortBy?.type) {
    case PoolSortType.NAME:
      stages.push({
        $sort: {
          name: sortBy?.direction === PoolSortDirection.DESC ? -1 : 1,
        },
      })
      break
    case PoolSortType.INTEREST:
      stages.push({
        $sort: {
          lowestAPR: sortBy?.direction === PoolSortDirection.DESC ? -1 : 1,
          name: 1,
        },
      })
      break
    case PoolSortType.LTV:
      stages.push({
        $sort: {
          maxLTV: sortBy?.direction === PoolSortDirection.DESC ? -1 : 1,
          name: 1,
        },
      })
      break
    case PoolSortType.UTILIZATION:
      stages.push({
        $sort: {
          utilizationEth: sortBy?.direction === PoolSortDirection.DESC ? -1 : 1,
          name: 1,
        },
      })
      break
    }

    return stages
  }
  catch (err) {
    throw fault('ERR_SEARCH_PUBLISHED_POOLS_GET_PIPELINE_STAGES', undefined, err)
  }
}
