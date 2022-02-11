import _ from 'lodash'
import Blockchain, { EthBlockchain } from '../entities/Blockchain'
import GlobalStats from '../entities/GlobalStats'
import { $USD } from '../entities/Value'
import { getEthValueUSD } from '../utils/ethereum'
import logger from '../utils/logger'
import getPoolLent from './getPoolLent'
import getPools from './getPools'

export default async function getGlobalStats(blockchains?: Blockchain[]) {
  logger.info('Fetching global stats...')

  const ethBlockchain = blockchains?.find(blockchain => blockchain.network === 'ethereum') ?? EthBlockchain()

  const [
    ethValueUSD,
    pools,
  ] = await Promise.all([
    getEthValueUSD(),
    getPools({ ethereum: ethBlockchain }),
  ])

  const totalCapacityUSD = _.sumBy(pools, t => (t.valueLocked?.amount ?? NaN) - (t.utilization?.amount ?? NaN)) * ethValueUSD.amount
  const totalUtilizationUSD = _.sumBy(pools, t => t.utilization?.amount ?? NaN) * ethValueUSD.amount
  const tvlUSD =  totalUtilizationUSD + totalCapacityUSD

  const lentPerPool = await Promise.all(pools.map(pool => getPoolLent({ poolAddress: pool.address }, ethBlockchain)))
  const totalLentlUSD = _.sumBy(lentPerPool, t => t.amount) * ethValueUSD.amount

  const globalStats: GlobalStats = {
    capacity: $USD(totalCapacityUSD),
    totalValueLentHistorical: $USD(totalLentlUSD),
    totalValueLocked: $USD(tvlUSD),
    utilization: $USD(totalUtilizationUSD),
    utilizationRatio: totalUtilizationUSD / tvlUSD,
  }

  logger.info('Fetching global stats... OK', globalStats)

  return globalStats
}
