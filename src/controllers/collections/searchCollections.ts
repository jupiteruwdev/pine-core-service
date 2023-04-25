import _ from 'lodash'
import appConf from '../../app.conf'
import { Blockchain, Collection, Value } from '../../entities'
import NFTSale from '../../entities/lib/NFTSale'
import fault from '../../utils/fault'
import logger from '../../utils/logger'
import postRequest from '../utils/postRequest'

import { NFTCollectionModel } from '../../db'
import DataSource from '../utils/DataSource'
import getRequest from '../utils/getRequest'
import getCollections from './getCollections'
import getFloorPrice from './getFloorPrice'
import getNFTSales from './getNFTSales'
import getSpamContracts from './getSpamContracts'

type Params = {
  query: string
  blockchain: Blockchain
}

const convertAlchemySupportMarketplace = (vendor?: string): string | undefined => {
  if (!vendor) return undefined

  switch (vendor.toLowerCase()) {
  case 'opensea':
    return 'seaport'
  default:
    return vendor.toLowerCase()
  }
}

async function aggregateCollectionResults(collections: Collection[], blockchain: Blockchain): Promise<Collection[]> {
  const spamContracts = blockchain.network === 'ethereum' ? await getSpamContracts({ blockchain }) : []
  const nonSpamCollections = collections.filter((c: Collection) => !spamContracts.find(ad => ad.toLowerCase() === c.address.toLowerCase()))
  const addresses = nonSpamCollections.map(collection => collection.address.toLowerCase())
  const dbCollections = await NFTCollectionModel.find({ address: {
    $in: addresses,
  } })

  const collectionResults = await Promise.all(
    nonSpamCollections.map(async (collection: Collection) => {
      const sales = await getNFTSales({ blockchain, contractAddress: collection.address, marketplace: convertAlchemySupportMarketplace(_.keys(collection.vendorIds)?.[0] ?? undefined) })
      let floorPrice
      try {
        floorPrice = await getFloorPrice({ blockchain, contractAddress: collection.address })
      }
      catch (err) {
        floorPrice = Value.$ETH(0)
      }
      const dbCollection = dbCollections.find(c => c.address?.toLowerCase() === collection.address.toLowerCase())

      return {
        ...collection,
        ...dbCollection ? { imageUrl: dbCollection.imageUrl } : {},
        sales: sales.map((sale: any) => NFTSale.factory({
          marketplace: _.get(sale, 'marketplace'),
          collectionAddress: _.get(sale, 'contractAddress'),
          buyerAddress: _.get(sale, 'buyerAddress'),
          sellerAddress: _.get(sale, 'sellerAddress'),
          nftId: _.get(sale, 'tokenId'),
          transactionHash: _.get(sale, 'transactionHash'),
          quantity: _.get(sale, 'quantity'),
        })),
        floorPrice,
      }
    }),
  )

  return collectionResults
}

export default async function searchCollections({ query, blockchain }: Params): Promise<Collection[]> {
  logger.info(`Fetching collection by search text <${query}>...`)
  switch (blockchain.networkId) {
  case Blockchain.Ethereum.Network.MAIN:
    const collections = await DataSource.fetch(
      useAlchemyContract({ query, blockchain }),
      useAlchemy({ query, blockchain }),
      useGemXYZ({ query, blockchain }),
    )

    return aggregateCollectionResults(collections, blockchain)
  case Blockchain.Polygon.Network.MAIN:
    const collectionsPolygon = await DataSource.fetch(
      useAlchemyContract({ query, blockchain }),
      useAlchemy({ query, blockchain }),
      useGemXYZ({ query, blockchain }),
    )

    console.log('collectionsPolygon: ', collectionsPolygon)
    const polygonContracts = await getCollections({ blockchainFilter: Blockchain.parseFilter(blockchain) })

    return aggregateCollectionResults(collectionsPolygon.filter(collection => polygonContracts.find(con => con.address.toLowerCase() === collection.address.toLowerCase())), blockchain)
  case Blockchain.Ethereum.Network.GOERLI:
  case Blockchain.Polygon.Network.MUMBAI:
    const collectionsGoerli = await DataSource.fetch(
      useAlchemyContract({ query, blockchain }),
      useAlchemy({ query, blockchain }),
    )
    return collectionsGoerli
  default:
    const err = fault('ERR_UNSUPPORTED_BLOCKCHAIN')
    logger.error(`Fetching collection for search text <${query}>... ERR:`, err)
    throw err
  }
}

function useAlchemy({ query, blockchain }: { query: string; blockchain: Blockchain }): DataSource<Collection[]> {
  return async () => {
    const apiKey = appConf.alchemyAPIKey
    const collectionData = await getRequest(_.get(appConf.alchemyNFTAPIUrl, blockchain.networkId) + apiKey + '/searchContractMetadata',
      {
        params: {
          query,
        },
        timeout: 10000,
      })
    return collectionData.filter((cd: any) => cd?.contractMetadata?.tokenType === 'ERC721' && cd?.address && cd?.contractMetadata?.name && cd?.contractMetadata?.openSea?.collectionName).map((cd: any) => Collection.factory({
      address: cd?.address,
      blockchain,
      vendorIds: { opensea: cd?.contractMetadata?.openSea?.collectionName },
      name: cd?.contractMetadata?.name,
      imageUrl: cd?.contractMetadata?.openSea?.imageUrl ?? '',
    }))
  }
}

function useAlchemyContract({ query, blockchain }: { query: string; blockchain: Blockchain }): DataSource<Collection[]> {
  return async () => {
    const apiKey = appConf.alchemyAPIKey
    const cd = await getRequest(_.get(appConf.alchemyNFTAPIUrl, blockchain.networkId) + apiKey + '/getContractMetadata',
      {
        params: {
          contractAddress: query,
        },
        timeout: 10000,
      })
    if (!cd) throw fault('NO_SUCH_CONTRACT')
    return [Collection.factory({
      address: cd?.address,
      blockchain,
      vendorIds: { opensea: cd?.contractMetadata?.openSea?.collectionName },
      name: cd?.contractMetadata?.name,
      imageUrl: cd?.contractMetadata?.imageUrl ?? '',
    })]
  }
}

function useGemXYZ({ query, blockchain }: { query: string; blockchain: Blockchain }): DataSource<Collection[]> {
  return async () => {
    const apiKey = appConf.gemxyzAPIKey
    const collectionData = await postRequest('https://gem-public-api-v2.herokuapp.com/collections',
      {
        filters: { searchText: query },
        sort: { sevenDayVolume: -1 },
        limit: 10,
      },
      {
        headers: {
          'X-API-KEY': apiKey,
        },
        timeout: 10000,
      })
    const collections = _.get(collectionData, 'data')

    return collections.filter((cd: any) => cd.chainId === '1' && _.get(cd, 'addresses[0].address') && cd.name && cd.slug).map((cd: any) => Collection.factory({
      address: _.get(cd, 'addresses[0].address'),
      blockchain,
      vendorIds: { opensea: cd.slug },
      name: cd.name,
      imageUrl: cd.imageUrl ?? '',
    }))

  }
}
