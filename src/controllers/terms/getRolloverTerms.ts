import BigNumber from 'bignumber.js'
import sftABI from '../../abis/SolvSft.json' assert { type: 'json' }
import appConf from '../../app.conf'
import { Blockchain, Collection, NFT, Pool, RolloverTerms, Value } from '../../entities'
import fault from '../../utils/fault'
import logger from '../../utils/logger'
import { getEthNFTMetadata } from '../collaterals'
import { verifyCollectionWithMatcher } from '../collections'
import { getLoan, isLoanExtendable } from '../loans'
import searchPublishedMultiplePools from '../pools/searchPublishedMultiplePools'
import getEthWeb3 from '../utils/getEthWeb3'
import { getCollectionValuation, signValuation } from '../valuations'
import getSolvSFTValuation from '../valuations/getSolvSFTValuation'
import getFlashLoanSource from './getFlashLoanSource'

type Params = {
  blockchain: Blockchain
  collectionAddresses: string[]
  nftIds: string[]
  poolAddresses?: string[]
}

export default async function getRolloverTerms({
  blockchain,
  collectionAddresses,
  nftIds,
  poolAddresses,
}: Params): Promise<RolloverTerms[]> {
  logger.info(`Fetching rollover terms for NFT ID <${nftIds.join(',')}> and collection address <${collectionAddresses.join(',')}> on blockchain <${JSON.stringify(blockchain)}>...`)

  try {
    if (!Blockchain.isEVMChain(blockchain)) throw fault('ERR_UNSUPPORTED_BLOCKCHAIN')
    // verify collection is valid one with matcher
    await verifyCollectionWithMatcher({ blockchain, collectionAddresses, matchSubcollectionBy: { type: 'nftId', values: nftIds } })
    const canRollover = await Promise.all(collectionAddresses.map((collectionAddress, index) => isLoanExtendable({ blockchain, collectionAddress, nftId: nftIds[index] })))
    if (canRollover.find(cR => !cR)) throw fault('ERR_INVALID_ROLLOVER')
    const blockchainFilter = Blockchain.parseFilter(blockchain)
    let pools = await searchPublishedMultiplePools({ collectionAddresses, blockchainFilter, includeInvalidTenors: false })
    if (pools.filter(pool => poolAddresses?.find(poolAddress => pool.address === poolAddress.toLowerCase())).length) {
      pools = pools.filter(pool => poolAddresses?.find(poolAddress => pool.address === poolAddress.toLowerCase()))
    }
    const web3 = getEthWeb3(blockchain.networkId)

    const sftPools = pools.filter(pool => !!pool.collection.sftMarketId)

    for (const pool of sftPools) {
      const collectionIndex = collectionAddresses.findIndex(address => address === pool.collection.address)
      const sftContract = new web3.eth.Contract(sftABI as any, web3.utils.toChecksumAddress(pool.collection.address))

      // Check if the nftId belongs to the marketId
      const nftMarketId = await sftContract.methods.slotOf(nftIds[collectionIndex]).call()
      if (nftMarketId !== pool.collection.sftMarketId) {
        pools = pools.filter(p => p.address !== pool.address)
      }
    }

    if (!pools) throw fault('ERR_NO_POOLS_AVAILABLE')
    if (pools.find(pool => pool.collection.valuation && (pool.collection.valuation?.timestamp || 0) < new Date().getTime() - appConf.valuationLimitation)) {
      throw fault('INVALID_VALUATION_TIMESTAMP')
    }
    const loans: any[] = []
    await Promise.all(collectionAddresses.map(async (collectionAddress, index) => {
      loans.push(await getLoan({ blockchain, collectionAddress, nftId: nftIds[index], populateValuation: false, txSpeedBlocks: 0 }))
    }))

    const flashLoanSources: Record<string, any> = {}
    await Promise.all(pools.map(async (pool, index) => {
      flashLoanSources[pool.address] = await getFlashLoanSource({ blockchain, poolAddress: pool.address, originalPoolAddress: loans[index]?.poolAddress })
    }))

    const nftsMetadata = await Promise.all(collectionAddresses.map((collectionAddress, index) => getEthNFTMetadata({ blockchain, collectionAddress, nftId: nftIds[index] })))

    const nfts: NFT[] = []
    for (let i = 0; i < collectionAddresses.length; i++) {
      nfts.push({
        collection: Collection.factory({ address: collectionAddresses[i], blockchain }),
        id: nftIds[i],
        ...nftsMetadata[i],
      })
    }

    const associatedPools = await Promise.all(pools.map((pool, index) => new Promise<Pool>(async (resolve, reject) => {
      if (pool.collection.sftMarketId) {
        const valuation = await getSolvSFTValuation({ blockchain: blockchain as Blockchain<'ethereum'>, collection: pool.collection, nftId: nftIds[index] })
        resolve({
          ...pool,
          collection: {
            ...pool.collection,
            valuation,
          },
        })
      }
      else if (pool.collection.valuation) resolve(pool)
      else {
        const valuation = await getCollectionValuation({ blockchain: blockchain as Blockchain, collectionAddress: collectionAddresses[index], nftId: nftIds[index] })
        resolve({
          ...pool,
          collection: {
            ...pool.collection,
            valuation,
          },
        })
      }
    })))
    const loanTerms: RolloverTerms[] = []
    for (let i = 0; i < collectionAddresses.length; i++) {
      const collectionPools = associatedPools.filter(pool => collectionAddresses[i].toLowerCase() === pool.collection.address.toLowerCase())
      for (let j = 0; j < collectionPools?.length; j++) {
        if (!(collectionPools[j].ethLimit !== 0 && collectionPools[j].loanOptions.some(option => collectionPools[j].utilization.amount.plus(option.maxBorrow?.amount ?? new BigNumber(0)).gt(new BigNumber(collectionPools[j].ethLimit ?? 0))))) {
          const valuation = collectionPools[j].collection.valuation
          if (valuation?.value?.amount.isPositive()) {
            try {
              const { signature, issuedAtBlock, expiresAtBlock } = await signValuation({ blockchain, nftId: nftIds[i], collectionAddress: collectionAddresses[i], valuation, poolVersion: collectionPools[j].version })

              const loanTerm = RolloverTerms.factory({
                routerAddress: collectionPools[j].rolloverAddress,
                flashLoanSourceContractAddress: flashLoanSources[collectionPools[j].address].address,
                maxFlashLoanValue: flashLoanSources[collectionPools[j].address].capacity,
                valuation,
                signature,
                options: collectionPools[j].loanOptions,
                nft: nfts[i],
                issuedAtBlock,
                expiresAtBlock,
                poolAddress: collectionPools[j].address,
                collection: nfts[i].collection,
              })

              loanTerm.options.map(option => {
                option.maxBorrow = Value.$ETH(option.maxLTVBPS.div(10_000).times(loanTerm.valuation.value?.amount ?? 0).toFixed(appConf.ethMaxDecimalPlaces, BigNumber.ROUND_DOWN))
                option.fees = [
                ]
              })

              loanTerms.push(loanTerm)
              logger.info(`Fetching rollover terms for NFT ID <${nftIds[i]}> and collection address <${collectionAddresses[i]}> on blockchain <${JSON.stringify(blockchain)}>... OK:`, loanTerms)

              break
            }
            catch (err) {
              logger.info(`Signing valuation error for NFT ID <${nftIds[i]}> and collection address <${collectionAddresses[i]}> on blockchain <${JSON.stringify(blockchain)}>... ERR:`, err)
            }
          }
        }
      }
    }

    const exactLoanTerm = loanTerms.find(loanTerm => loanTerm.poolAddress.toLowerCase() === poolAddresses?.[0].toLowerCase())

    return exactLoanTerm ? [exactLoanTerm] : loanTerms
  }
  catch (err) {
    logger.error(`Fetching rollover terms for NFT ID <${nftIds.join(',')}> and collection address <${collectionAddresses.join(',')}> on blockchain <${JSON.stringify(blockchain)}>... ERR:`, err)

    throw fault('ERR_GET_ROLLOVER_TERMS', undefined, err)
  }
}
