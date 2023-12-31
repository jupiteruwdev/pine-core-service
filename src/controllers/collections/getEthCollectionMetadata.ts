import _ from 'lodash'
import { PipelineStage } from 'mongoose'
import appConf from '../../app.conf'
import { NFTCollectionModel, PoolModel } from '../../database'
import { Blockchain, CollectionMetadata } from '../../entities'
import fault from '../../utils/fault'
import logger from '../../utils/logger'
import { convertToMoralisChain } from '../../utils/moralis'
import { getRedisCache, setRedisCache } from '../../utils/redis'
import rethrow from '../../utils/rethrow'
import { getEthNFTMetadata } from '../collaterals'
import DataSource from '../utils/DataSource'
import getRequest from '../utils/getRequest'
import { useReservoirCollections } from '../utils/useReservoirAPI'

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

    const redisKey = `collection:metadata:${params.collectionAddress}:${params.matchSubcollectionBy?.value ? `${params.matchSubcollectionBy?.value}:` : ''}${blockchain.networkId}`

    let metadata = await getRedisCache(redisKey)

    if (metadata) {
      return metadata as CollectionMetadata
    }

    switch (blockchain.network) {
    case 'ethereum':
      metadata = await DataSource.fetch(
        useDb({ blockchain, ...params }),
        useOpenSea({ blockchain, ...params }),
        useReservoir({ blockchain, ...params }),
        useMoralis({ blockchain, ...params }),
      )
      break
    case 'polygon':
    case 'arbitrum':
      metadata = await DataSource.fetch(
        useDb({ blockchain, ...params }),
        useReservoir({ blockchain, ...params }),
        useMoralis({ blockchain, ...params }),
      )
      break
    default:
      throw fault('ERR_UNSUPPORTED_BLOCKCHAIN')
    }

    logger.info(`Fetching metadata for collection using params <${JSON.stringify(params)}> on blockchain <${JSON.stringify(blockchain)}>... OK`)
    logger.debug(JSON.stringify(metadata, undefined, 2))

    await setRedisCache(redisKey, metadata, { EX: 900 })

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
    try {
      logger.info('...using db to look up metadata for collection')

      if (!Blockchain.isEVMChain(blockchain)) rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

      let docs

      if (typeof matchSubcollectionBy === undefined) {
        const doc = await NFTCollectionModel.find({ address: {
          $regex: collectionAddress,
          $options: 'i',
        } }).lean()

        return {
          name: _.get(doc, 'displayName'),
          imageUrl: _.get(doc, 'imageUrl'),
          vendorIds: _.get(doc, 'vendorIds'),
          sftMarketId: _.get(doc, 'sftMarketId'),
          sftDenomination: _.get(doc, 'sftDenomination'),
          sftMarketName: _.get(doc, 'sftMarketName'),
        }
      }

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
      case 'nftId':
        const docsWithMatcher = docs.filter(t => _.isString(_.get(t, 'matcher.regex')) && _.isString(_.get(t, 'matcher.fieldPath')))

        if (docsWithMatcher.length > 0) {
          const nftId = matchSubcollectionBy.value
          const nftMetadata = await getEthNFTMetadata({ blockchain, collectionAddress: docs[0].address, nftId })
          const nftProps = { id: nftId, ...nftMetadata }

          const doc = _.find(docsWithMatcher, t => {
            const regex = new RegExp(t.matcher.regex)
            if (regex.test(_.get(nftProps, t.matcher.fieldPath))) return true
            return false
          })

          if (doc) {
            metadata = {
              name: _.get(doc, 'displayName'),
              imageUrl: _.get(doc, 'imageUrl'),
              vendorIds: _.get(doc, 'vendorIds'),
              sftMarketId: _.get(doc, 'sftMarketId'),
              sftDenomination: _.get(doc, 'sftDenomination'),
              sftMarketName: _.get(doc, 'sftMarketName'),
            }

            break
          }
        }

        // Fallthrough
      case 'poolAddress':
        // Fallthrough
      default:
        if (docs.length > 1) rethrow('Unable to determine collection metadata due to more than 1 collection found')

        const doc = docs[0]

        if (doc.matcher !== undefined) rethrow('Matcher expected for found collection')

        metadata = {
          name: _.get(doc, 'displayName'),
          imageUrl: _.get(doc, 'imageUrl'),
          vendorIds: _.get(doc, 'vendorIds'),
          sftMarketId: _.get(doc, 'sftMarketId'),
          sftDenomination: _.get(doc, 'sftDenomination'),
          sftMarketName: _.get(doc, 'sftMarketName'),
        }
      }

      return metadata
    }
    catch (err) {
      throw fault('ERR_GET_COLLECTION_METADATA_USE_DB', undefined, err)
    }
  }
}

export function useOpenSea({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    try {
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
    catch (err) {
      throw fault('ERR_GET_COLLECTION_METADATA_USE_OPENSEA', undefined, err)
    }
  }
}

export function useReservoir({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    try {
      logger.info(`...using Reservoir to look up metadata for collection <${collectionAddress}>`)

      if (collectionAddress === undefined) rethrow('Collection address must be provided')
      if (!Blockchain.isEVMChain(blockchain)) rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

      const collectionInfo = await useReservoirCollections({ collectionAddresses: [collectionAddress], blockchain })

      const name = _.get(collectionInfo.collections[0], 'name')
      const imageUrl = _.get(collectionInfo.collections[0], 'image')

      return {
        name,
        imageUrl,
      }
    }
    catch (err) {
      throw fault('ERR_GET_COLLECTION_METADATA_USE_RESERVOIR', undefined, err)
    }
  }
}

export function useMoralis({ blockchain, collectionAddress }: Params): DataSource<CollectionMetadata> {
  return async () => {
    try {
      logger.info(`...using Moralis to look up metadata for collection <${collectionAddress}>`)

      if (collectionAddress === undefined) rethrow('Collection address must be provided')
      if (!Blockchain.isEVMChain(blockchain)) rethrow(`Unsupported blockchain <${JSON.stringify(blockchain)}>`)

      const apiKey = appConf.moralisAPIKey ?? rethrow('Missing Moralis API key')

      const res = await getRequest(`https://deep-index.moralis.io/api/v2/nft/${collectionAddress}/metadata`, {
        headers: {
          'X-API-Key': apiKey,
        },
        params: {
          chain: convertToMoralisChain(blockchain.networkId),
        },
      }).catch(err => rethrow(`Failed to fetch metadata from Moralis for collection <${collectionAddress}>: ${err}`))

      const name = _.get(res, 'name')
      const imageUrl = undefined // Moralis API does not provide collection image

      return {
        name,
        imageUrl,
      }
    }
    catch (err) {
      throw fault('ERR_GET_COLLECTION_METADATA_USE_MORALIS', undefined, err)
    }
  }
}
