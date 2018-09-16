import express from 'express'
import { isBoolean, size } from 'lodash'
import { callTestRunner } from 'utils/testRunner'
import { rtdbRef } from 'utils/rtdb'
import { hasAll } from 'utils'
import { Promise } from 'bluebird'
import { isArray } from 'util'

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
  const { jobRunKey, pending, stats, suites } = req.body
  if (!jobRunKey) {
    return res.status(400).send('jobRunKey is required')
  }
  // const { uid: createdBy } = req.user
  try {
    console.log('report request:', { jobRunKey, body: req.body })
    const metaRef = rtdbRef(`test_runs_meta/${jobRunKey}`)
    const dataRef = rtdbRef(`test_runs_data/${jobRunKey}`)
    const metaUpdate = {}
    if (isBoolean(pending)) {
      metaUpdate.pending = pending
    }
    if (stats) {
      metaUpdate.stats = stats
    }
    if (size(metaUpdate)) {
      await metaRef.update(metaUpdate)
    }
    if (suites) {
      await Promise.all(suites.map(testData => dataRef.push(testData)))
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
