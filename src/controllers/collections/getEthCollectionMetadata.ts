import _ from 'lodash'
import { PipelineStage } from 'mongoose'
import appConf from '../../app.conf'
import { NFTCollectionModel, PoolModel } from '../../db'
import { Blockchain, CollectionMetadata } from '../../entities'
import logger from '../../utils/logger'
import rethrow from '../../utils/rethrow'
import { getEthNFTMetadata } from '../collaterals'
import DataSource from '../utils/DataSource'
import getRequest from '../utils/getRequest'

type Params = {
  blockchain: Blockchain
  collectionAddress?: string
  matchSubcollectionBy?: {
    value: string
    type: 'poolAddress' | 'nftId'
  }
}

export default async function getEthCollectionMetadata({
  blockchain,
  ...params
}: Params): Promise<CollectionMetadata> {
  try {
    logger.info(`Fetching metadata for collection using params <${JSON.stringify(params)}> on blockchain <${JSON.stringify(blockchain)}>...`)

    const dataSource = DataSource.compose(
      useDb({ blockchain, ...params }),
      useOpenSea({ blockchain, ...params }),
      useAlchemy({ blockchain, ...params }),
      useMoralis({ blockchain, ...params }),
    )

    const metadata = await dataSource.apply(undefined)

    logger.info(`Fetching metadata for collection using params <${JSON.stringify(params)}> on blockchain <${JSON.stringify(blockchain)}>... OK`)
    logger.debug(JSON.stringify(metadata, undefined, 2))

    return metadata
  }
  catch (err) {
    logger.warn(`Fetching metadata for collection using params <${JSON.stringify(params)}> on blockchain <${JSON.stringify(blockchain)}>... WARN`)
    if (logger.isWarnEnabled() && !logger.silent) console.warn(err)

    return {}
  }
}

export function useDb({ blockchain, collectionAddress, matchSubcollectionBy }: Params): DataSource<CollectionMetadata> {
  return async () => {
    logger.info('...using db to look up metadata for collection')

    if (blockchain?.network !== 'ethereum') rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

    let docs

    if (matchSubcollectionBy?.type === 'poolAddress') {
      const stages: PipelineStage[] = [{
        $match: {
          'networkType': blockchain.network,
          'networkId': blockchain.networkId,
          'address': {
            $regex: matchSubcollectionBy.value,
            $options: 'i',
          },
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
      ...collectionAddress === undefined ? [] : [{
        $match: {
          'collection.address': {
            $regex: collectionAddress,
            $options: 'i',
          },
        },
      }], {
        $replaceRoot: {
          newRoot: '$collection',
        },
      }]

      docs = await PoolModel.aggregate(stages).exec()
    }
    else {
      if (collectionAddress === undefined) rethrow('Parameter `collectionAddress` is required unless pool address is provided')

      const stages: PipelineStage[] = [{
        $match: {
          'networkType': blockchain.network,
          'networkId': blockchain.networkId,
          'address': {
            $regex: collectionAddress,
            $options: 'i',
          },
        },
      }]

      docs = await NFTCollectionModel.aggregate(stages).exec()
    }

    if (docs.length === 0) rethrow('No matching collection found in db')

    let metadata

    switch (matchSubcollectionBy?.type) {
      case 'nftId': {
        const nftId = matchSubcollectionBy.value
        const dict = docs.reduce((prev, curr) => {
          const hasMatcher = _.isString(_.get(curr, 'matcher.regex')) && _.isString(_.get(curr, 'matcher.fieldPath'))

          if (hasMatcher) {
            return { ...prev, withMatcher: [...prev.withMatcher, curr] }
          }
          else {
            return { ...prev, withoutMatcher: [...prev.withoutMatcher, curr] }
          }
        }, { withMatcher: [], withoutMatcher: [] })

        if (dict.withMatcher.length === 0) {
          // Fallthrough
        }
        else {
          const nftMetadata = await getEthNFTMetadata({ blockchain, collectionAddress: docs[0].address, nftId })
          const nft = { id: nftId, ...nftMetadata }

          const doc = _.find(dict.withMatcher, t => {
            const regex = new RegExp(t.matcher.regex)
            if (regex.test(_.get(nft, t.matcher.fieldPath))) return true
            return false
          })

          if (doc) {
            metadata = {
              name: _.get(doc, 'displayName'),
              imageUrl: _.get(doc, 'imageUrl'),
              vendorIds: _.get(doc, 'vendorIds'),
            }
          }
          else {
            if (dict.withoutMatcher.length > 1) rethrow('Unable to determine collection metadata due to more than 1 collection found')

            const doc = dict.withoutMatcher[0]

            metadata = {
              name: _.get(doc, 'displayName'),
              imageUrl: _.get(doc, 'imageUrl'),
              vendorIds: _.get(doc, 'vendorIds'),
            }
          }

          break
        }
      }
      case 'poolAddress': // Fallthrough
      default: {
        if (docs.length > 1) rethrow('Unable to determine collection metadata due to more than 1 collection found')

        const doc = docs[0]

        if (doc.matcher !== undefined) rethrow('Matcher expected for found collection')

        metadata = {
          name: _.get(doc, 'displayName'),
          imageUrl: _.get(doc, 'imageUrl'),
          vendorIds: _.get(doc, 'vendorIds'),
        }
      }
    }

    return {
      ...metadata,
      isSupported: true,
    }
  }
}

export function useOpenSea({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    logger.info(`...using OpenSea to look up metadata for collection ${collectionAddress}`)

    if (collectionAddress === undefined) rethrow('Collection address must be provided')
    if (blockchain?.network !== 'ethereum') rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

    const apiKey = appConf.openseaAPIKey ?? rethrow('Missing OpenSea API key')
    let res

    switch (blockchain.networkId) {
    case Blockchain.Ethereum.Network.MAIN:
      res = await getRequest(`https://api.opensea.io/api/v1/asset_contract/${collectionAddress}`, { headers: { 'X-API-KEY': apiKey } }).catch(err => rethrow(`Failed to fetch metadata from OpenSea for collection <${collectionAddress}>: ${err}`))
      break
    case Blockchain.Ethereum.Network.RINKEBY:
      res = await getRequest(`https://testnets-api.opensea.io/api/v1/asset_contract/${collectionAddress}`, { headers: { 'X-API-KEY': apiKey } }).catch(err => rethrow(`Failed to metadata from OpenSea for collection <${collectionAddress}>: ${err}`))
      break
    }

    if (res === undefined) rethrow('Unexpected payload when looking up collection metadata from OpenSea')

    const name = _.get(res, 'collection.name')
    const imageUrl = _.get(res, 'collection.image_url')
    const vendorId = _.get(res, 'collection.slug')

    const metadata = {
      name,
      imageUrl,
      vendorIds: {
        opensea: vendorId,
      },
    }

    return metadata
  }
}

export function useAlchemy({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    logger.info(`...using Alchemy to look up metadata for collection <${collectionAddress}>`)

    if (collectionAddress === undefined) rethrow('Collection address must be provided')
    if (blockchain?.network !== 'ethereum') rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

    const apiHost = _.get(appConf.alchemyAPIUrl, blockchain.networkId) ?? rethrow(`Missing Alchemy API URL for blockchain <${JSON.stringify(blockchain)}>`)
    const apiKey = appConf.alchemyAPIKey ?? rethrow('Missing Alchemy API key')

    const res = await getRequest(`${apiHost}${apiKey}/getContractMetadata`, {
      params: {
        contractAddress: collectionAddress,
      },
    }).catch(err => rethrow(`Failed to fetch metadata from Alchemy for collection <${collectionAddress}>: ${err}`))

    const name = _.get(res, 'contractMetadata.name')
    const imageUrl = undefined // Alchemy API does not provide collection image

    return {
      name,
      imageUrl,
    }
  }
}

export function useMoralis({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    logger.info(`...using Moralis to look up metadata for collection <${collectionAddress}>`)

    if (collectionAddress === undefined) rethrow('Collection address must be provided')
    if (blockchain?.network !== 'ethereum') rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

    const apiKey = appConf.moralisAPIKey ?? rethrow('Missing Moralis API key')

    const res = await getRequest(`https://deep-index.moralis.io/api/v2/nft/${collectionAddress}/metadata`, {
      headers: {
        'X-API-Key': apiKey,
      },
      params: {
        chain: 'eth',
      },
    }).catch(err => rethrow(`Failed to fetch metadata from Moralis for collection <${collectionAddress}>: ${err}`))

    const name = _.get(res, 'name')
    const imageUrl = undefined // Moralis API does not provide collection image

    return {
      name,
      imageUrl,
    }
  }
}
