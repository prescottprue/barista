import express from 'express'
import runsController from './runs'

const router = express.Router()

router.use('/runs', runsController)

export default router
