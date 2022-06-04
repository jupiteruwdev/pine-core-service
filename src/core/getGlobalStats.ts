import BigNumber from 'bignumber.js'
import { BlockchainFilter, EthBlockchain } from '../entities/lib/Blockchain'
import EthereumNetwork from '../entities/lib/EthereumNetwork'
import GlobalStats from '../entities/lib/GlobalStats'
import SolanaNetwork from '../entities/lib/SolanaNetwork'
import { $USD } from '../entities/lib/Value'
import { getEthValueUSD } from '../utils/ethereum'
import failure from '../utils/failure'
import logger from '../utils/logger'
import getPoolHistoricalLent from './getPoolHistoricalLent'
import getPools from './getPools'

type Params = {
  blockchainFilter?: BlockchainFilter
}

export default async function getGlobalStats({ blockchainFilter = { ethereum: EthereumNetwork.MAIN, solana: SolanaNetwork.MAINNET } }: Params = {}): Promise<GlobalStats> {
  try {
    logger.info(`Fetching global stats for blockchain filter <${JSON.stringify(blockchainFilter)}>...`)

    const [
      ethValueUSD,
      pools,
    ] = await Promise.all([
      getEthValueUSD(),
      getPools({ blockchainFilter }),
    ])

    const totalUtilizationUSD = pools.reduce((p, c) => p.plus(c.utilization.amount), new BigNumber(0)).times(ethValueUSD.amount)
    const totalValueLockedUSD = pools.reduce((p, c) => p.plus(c.valueLocked.amount), new BigNumber(0)).times(ethValueUSD.amount)
    const totalCapacityUSD = totalValueLockedUSD.minus(totalUtilizationUSD)

    const lentEthPerPool = await Promise.all(pools.map(pool => getPoolHistoricalLent({ blockchain: EthBlockchain(blockchainFilter), poolAddress: pool.address })))
    const totalLentlUSD = lentEthPerPool.reduce((p, c) => p.plus(c.amount), new BigNumber(0)).times(ethValueUSD.amount)

    const globalStats: GlobalStats = {
      capacity: $USD(totalCapacityUSD),
      totalValueLentHistorical: $USD(totalLentlUSD),
      totalValueLocked: $USD(totalValueLockedUSD),
      utilization: $USD(totalUtilizationUSD),
      utilizationRatio: totalUtilizationUSD.div(totalValueLockedUSD),
    }

    logger.info('Fetching global stats... OK', globalStats)

    return globalStats
  }
  catch (err) {
    throw failure('FETCH_GLOBAL_STATS_FAILURE', err)
  }
}
