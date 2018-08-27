import express from 'express'
import { callTestRunner } from 'utils/testRunner'
const router = express.Router()

/**
 * Run tests by invoking mocha programatically
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function handleRunRequest(req, res) {
  const { instanceTemplateName } = req.body
  const { uid: createdBy } = req.user
  try {
    await callTestRunner({
      instanceTemplateName,
      createdBy,
      meta: { restRequest: true }
    })
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`Test run started!`)
  } catch (err) {
    console.error(`Error in test run request: ${err.message || ''}`, err)
    res.end(`Error!`)
  }
}

router.post('/run', handleRunRequest)

export default router
