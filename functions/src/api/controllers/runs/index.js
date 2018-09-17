import express from 'express'
import { callTestRunner } from 'utils/testRunner'
import { rtdbRef } from 'utils/rtdb'
import { hasAll } from 'utils'
import { Promise } from 'bluebird'

const router = express.Router()

/**
 * Run tests by invoking test runner (calls callGoogleApi Cloud Function)
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

/**
 * Handle incomping report data from test runs
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function handleReportRequest(req, res) {
  const requiredKeys = ['jobRunKey', 'baristaProjectId']
  if (!req.body || !hasAll(req.body, requiredKeys)) {
    return res
      .status(400)
      .send(`Body containing keys ${requiredKeys.join(', ')} required`)
  }
  const { jobRunKey, suites } = req.body
  console.log('report request:', { jobRunKey, body: req.body })
  try {
    const dataRef = rtdbRef(`test_runs_data/${jobRunKey}`)
    // TODO: Map tests data to be push keys instead of an array
    // It may ta doing multiple empty .push() calls to get keys, mapping them, and doing one set
    if (suites) {
      await Promise.all(suites.map(suiteData => dataRef.push(suiteData)))
    }
    res.send(`Report received, thanks!`)
  } catch (err) {
    console.error(`Error in report request: ${err.message || ''}`, err)
    res.end(`Error!`)
  }
}

router.post('/start', handleRunRequest)
router.post('/sendReport', handleReportRequest)

export default router
