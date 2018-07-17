import express from 'express'
import testsController from './tests'

const router = express.Router()

router.use('/tests', testsController)

export default router
