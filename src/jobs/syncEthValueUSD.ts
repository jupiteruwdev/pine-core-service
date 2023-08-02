import getEthValueUSD from '../controllers/utils/getEthValueUSD'
import { AvailableToken } from '../controllers/utils/getTokenUSDPrice'
import { PriceModel, initDb } from '../db'
import fault from '../utils/fault'
import logger from '../utils/logger'
import { getRedisCache, setRedisCache } from '../utils/redis'
import _ from 'lodash'

export default async function syncEthValueUSD() {
  try {
    await initDb({
      onError: err => {
        logger.error('Establishing database conection... ERR:', err)
        throw fault('ERR_DB_CONNECTION', undefined, err)
      },
      onOpen: () => {
        logger.info('Establishing database connection... OK')
      },
    })

    for (const token of Object.keys(AvailableToken).filter(key => key !== 'PINE')) {
      const redisKey = `eth:value:usd:${AvailableToken[token as keyof typeof AvailableToken]}`

      const cachedValue = await getRedisCache(redisKey)

      if (cachedValue) {
        const timestamp = _.get(cachedValue, 'timestamp')
        if (Date.now() - timestamp <= 60 * 5 * 1000) {
          logger.info(`Cached ${AvailableToken[token as keyof typeof AvailableToken]} value in USD:`, cachedValue)
          continue
        }
      }
      logger.info(`JOB_SYNC_ETH_VALUE_USD fetching ${AvailableToken[token as keyof typeof AvailableToken]} price in usd`)
      const tokenPrice = await getEthValueUSD(1, AvailableToken[token as keyof typeof AvailableToken])
      await setRedisCache(redisKey, tokenPrice)
      const price = await PriceModel.findOne({ name: AvailableToken[token as keyof typeof AvailableToken] })
      if (price) {
        await price.update({
          value: tokenPrice,
        })
      }
      else {
        await PriceModel.create({
          name: AvailableToken[token as keyof typeof AvailableToken],
          value: tokenPrice,
        })
      }
      logger.info(`JOB_SYNC_ETH_VALUE_USD fetching ${AvailableToken[token as keyof typeof AvailableToken]} price in usd... OK`)
    }
  }
  catch (err) {
    logger.info('JOB_SYNC_ETH_VALUE_USD fetching eth price in usd... ERR:', err)
    process.exit(1)
  }
}

syncEthValueUSD()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err)
    process.exit(1) // Retry Job Task by exiting the process
  })
