import Web3 from 'web3'
import { findOneCollection } from '../db'
import { EthBlockchain, EthereumNetwork, PNPLTerms } from '../entities'
import failure from '../utils/failure'
import getLooksrarePNPLTerms from './getLooksrarePNPLTerms'
import getOpenseaPNPLTerms from './getOpenseaPNPLTerms'

type Params = {
  parsedURL: URL
}

/**
 *
 * @param params - See {@link Params}.
 *
 * @returns pnpl terms.
 */
export default async function getPNPLTermsByUrl({ parsedURL }: Params): Promise<PNPLTerms> {
  const hostname = parsedURL.hostname

  switch (hostname) {
  case 'opensea.io': {
    const [, , , collectionAddress, nftId] = parsedURL.pathname.split('/')
    if (!Web3.utils.isAddress(collectionAddress)) throw failure('PNPL_INVALID_URL')
    if (!collectionAddress || !nftId) throw failure('PNPL_INVALID_URL')

    const collection = await findOneCollection({ address: collectionAddress, blockchain: EthBlockchain(EthereumNetwork.MAIN) })
    if (!collection) throw failure('UNSUPPORTED_COLLECTION')

    return getOpenseaPNPLTerms({
      openseaVersion: 'main',
      blockchain: EthBlockchain(EthereumNetwork.MAIN),
      collectionId: collection.id,
      nftId,
    })
  }
  case 'testnets.opensea.io': {
    const [, , , collectionAddress, nftId] = parsedURL.pathname.split('/')
    if (!Web3.utils.isAddress(collectionAddress)) throw failure('PNPL_INVALID_URL')
    if (!collectionAddress || !nftId) throw failure('PNPL_INVALID_URL')

    const collection = await findOneCollection({ address: collectionAddress, blockchain: EthBlockchain(EthereumNetwork.RINKEBY) })
    if (!collection) throw failure('UNSUPPORTED_COLLECTION')

    return getOpenseaPNPLTerms({
      openseaVersion: 'rinkeby',
      blockchain: EthBlockchain(EthereumNetwork.RINKEBY),
      collectionId: collection.id,
      nftId,
    })
  }
  case 'looksrare.org': {
    // https://looksrare.org/collections/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/3060
    const [, , collectionAddress, nftId] = parsedURL.pathname.split('/')
    if (!Web3.utils.isAddress(collectionAddress)) throw failure('PNPL_INVALID_URL')
    if (!collectionAddress || !nftId) throw failure('PNPL_INVALID_URL')

    const collection = await findOneCollection({ address: collectionAddress, blockchain: EthBlockchain(EthereumNetwork.MAIN) })
    if (!collection) throw failure('UNSUPPORTED_COLLECTION')

    return getLooksrarePNPLTerms({
      blockchain: EthBlockchain(EthereumNetwork.MAIN),
      collectionId: collection.id,
      nftId,
    })
  }
  case 'rinkeby.looksrare.org': {
    // https://looksrare.org/collections/0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949/3060
    const [, , collectionAddress, nftId] = parsedURL.pathname.split('/')
    if (!Web3.utils.isAddress(collectionAddress)) throw failure('PNPL_INVALID_URL')
    if (!collectionAddress || !nftId) throw failure('PNPL_INVALID_URL')

    const collection = await findOneCollection({ address: collectionAddress, blockchain: EthBlockchain(EthereumNetwork.RINKEBY) })
    if (!collection) throw failure('UNSUPPORTED_COLLECTION')

    return getLooksrarePNPLTerms({
      blockchain: EthBlockchain(EthereumNetwork.RINKEBY),
      collectionId: collection.id,
      nftId,
    })
  }
  default:
    throw failure('UNSUPPORTED_MARKETPLACE')
  }
}
