import * as functions from 'firebase-functions'
import { to } from '../utils/async'
import { waitForValue, rtdbRef } from '../utils/rtdb'
import { get } from 'lodash'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function cleanupRunnerEvent(change, context) {
  const {
    params: { projectId, jobRunKey }
  } = context
  const status = change.after.val()
  console.log('Status update:', { jobRunKey, projectId }, change.after.ref)

  // Skip cleanup if status is not "passed" or "failed"
  if (status !== 'passed' && status !== 'failed') {
    console.log(
      `Status updated to "${status}", which does not require cleanup. Exiting...`
    )
    return null
  }

  console.log(`Cleanup runner triggered for ${projectId}/${jobRunKey}`)

  // Get test run meta data (event is on the level of status)
  const testRunMetaRef = change.after.ref.parent
  const [getDataErr, jobRunDataSnap] = await to(testRunMetaRef.once('value'))

  // Handle errors getting job run data
  if (getDataErr) {
    console.error(
      `Error getting job run data: ${getDataErr.message || ''}`,
      getDataErr
    )
    throw getDataErr
  }
  console.log('job run data:', jobRunDataSnap.val())
  const { resourceUrl } = get(jobRunDataSnap.val(), 'instanceMeta', {})

  // Throw for missing resourceUrl (needed to delete instance)
  if (!resourceUrl) {
    const missingIdErr =
      'resourceUrl is required on instanceMeta in order to delete'
    console.error(missingIdErr)
    throw new Error(missingIdErr)
  }

  const removeRequestRef = rtdbRef('requests/callGoogleApi').push()
  const removeResponseRef = rtdbRef(
    `requests/callGoogleApi/${removeRequestRef.key}`
  )

  // Request delete through Compute REST API using callGoogleApi
  const [requestErr] = await to(
    removeRequestRef.set({
      method: 'DELETE',
      api: 'compute',
      suffix: resourceUrl
    })
  )

  // Handle errors writing request to callGoggleApi function
  if (requestErr) {
    console.error(
      `Error pushing request to callGoogleApi function: ${requestErr.message ||
        ''}`,
      requestErr
    )
    throw requestErr
  }

  const [startedUpdateErr] = await to(
    testRunMetaRef.update({ instanceDeleteStarted: true })
  )

  // Handle errors marking meta with instanceDeleteStarted: true
  if (startedUpdateErr) {
    console.error(
      `Error updating job run meta: ${startedUpdateErr.message || ''}`,
      startedUpdateErr
    )
    throw startedUpdateErr
  }

  // Watch delete request response for results from callGoogleApi function
  const [responseErr] = await to(waitForValue(removeResponseRef))
  if (responseErr) {
    console.error(
      `Error in cleanup request: ${responseErr.message || ''}`,
      responseErr
    )
    const [errorUpdateErr] = await to(
      testRunMetaRef.update({ instanceDeleteFailed: true })
    )
    if (errorUpdateErr) {
      console.error(
        `Error updating test run meta with instanceDeleteFailed: ${errorUpdateErr.message ||
          ''}`,
        errorUpdateErr
      )
    }

    throw responseErr
  }

  // Update job run meta with finished
  const [finishedUpdateErr] = await to(
    testRunMetaRef.update({ instanceDeleteFinished: true })
  )

  // Handle errors marking meta with instanceDeleteFinished: true
  if (finishedUpdateErr) {
    console.error(
      `Error updating job run meta with instance delete finish: ${finishedUpdateErr.message ||
        ''}`,
      finishedUpdateErr
    )
    throw finishedUpdateErr
  }

  return null
}

/**
 * @name cleanupRunner
 * Cloud Function triggered by Real Time Database Update Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/test_runs_meta/{projectId}/{jobRunKey}/status')
  .onUpdate(cleanupRunnerEvent)
