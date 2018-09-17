import express from 'express'
import runsController from './runs'
import buildsController from './builds'

const router = express.Router()

router.use('/runs', runsController)
router.use('/builds', buildsController)

export default router
