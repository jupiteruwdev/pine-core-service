import { Router } from 'express'
import { getGlobalStats } from '../../controllers'
import { GlobalStats } from '../../entities'
import fault from '../../utils/fault'
import { getBlockchainFilter } from '../utils/query'

const router = Router()

router.get('/global', async (req, res, next) => {
  try {
    const blockchainFilter = getBlockchainFilter(req.query, false)
    const stats = await getGlobalStats({ blockchainFilter })
    const payload = GlobalStats.serialize(stats)

    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=30')
    res.status(200).json(payload)
  }
  catch (err) {
    next(fault('ERR_API_FETCH_GLOBAL_STATS', undefined, err))
  }
})

export default router
