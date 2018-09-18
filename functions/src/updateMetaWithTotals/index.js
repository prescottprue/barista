import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { forEach, reduce } from 'lodash'
import { to } from 'utils/async'
import { rtdbRef } from '../utils/rtdb'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function updateMetaWithTotalsEvent(change, context) {
  const {
    params: { projectId, jobRunKey }
  } = context
  const { after } = change
  const status = after.val()

  // Skip cleanup if status is not "passed" or "failed"
  if (status !== 'passed' && status !== 'failed') {
    console.log(
      `Status updated to "${status}", which does not require cleanup. Exiting...`
    )
    return null
  }

  // Get test run meta data (event is on the level of status)
  const testRunMetaRef = after.ref.parent

  // Get Runs Data
  const [getRunsData, runsDataSnap] = await to(
    rtdbRef(`test_runs_data/${projectId}/${jobRunKey}`).once('value')
  )

  if (getRunsData) {
    console.error(
      `Error getting runner request: ${getRunsData.message || ''}`,
      getRunsData
    )
    throw getRunsData
  }

  const runsData = runsDataSnap.val()

  // Handle runs data not existing
  if (!runsData) {
    const missingRunsDataErrMsg = 'No Runs Data Found'
    console.error(missingRunsDataErrMsg)
    throw new Error(missingRunsDataErrMsg)
  }

  const combinedStats = reduce(
    runsData,
    (acc, runData, runKey) => {
      if (runData.stats) {
        forEach(runData.stats, (statValue, statKey) => {
          if (statKey === 'start' && !acc[statKey]) {
            acc[statKey] = statValue
          } else if (acc[statKey]) {
            acc[statKey] = acc[statKey] + statValue
          }
        })
      }
      return acc
    },
    {
      duration: 0,
      failures: 0,
      passes: 0,
      pending: 0,
      suites: 0,
      tests: 0
    }
  )

  // Request sendFcm function to send message to creator of run request
  const [writeErr] = await to(
    testRunMetaRef.update({
      stats: combinedStats,
      statsUpdatedAt: admin.database.ServerValue.TIMESTAMP
    })
  )

  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }

  return null
}

/**
 * @name updateMetaWithTotals
 * Cloud Function triggered by Real Time Database Write Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/test_runs_meta/{projectId}/{jobRunKey}/runResult')
  .onWrite(updateMetaWithTotalsEvent)
