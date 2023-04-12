import { Router } from 'express'
import appConf from '../app.conf'
import getWorkerVersion from '../controllers/utils/getWorkerVersion'
import hookRouter from './hooks'
import jobsRouter from './jobs'
import v0Router from './v0'
import v1Router from './v1'

const router = Router()

router.get('/health', (req, res) => res.sendStatus(200))

router.get('/version', async (req, res) => {
  let workerVersion

  try {
    workerVersion = await getWorkerVersion()
  }
  catch (err) {
    workerVersion = String(err)
  }

  res.send({
    core: `${appConf.version}/${appConf.build}`,
    worker: workerVersion,
  })
})

router.use('/v0', v0Router)
router.use('/v1', v1Router)
router.use('/hook', hookRouter)
router.use('/jobs', jobsRouter)
router.use('/', v0Router)

export default router
