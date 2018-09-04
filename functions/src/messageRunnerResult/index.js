import * as functions from 'firebase-functions'
import { to } from 'utils/async'
import { rtdbRef } from '../utils/rtdb'
import { get } from 'lodash'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function messageRunnerResultEvent(change, context) {
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
  const [getDataErr, jobRunDataSnap] = await to(testRunMetaRef.once('value'))

  // Handle errors getting job run data
  if (getDataErr) {
    console.error(
      `Error getting job run data: ${getDataErr.message || ''}`,
      getDataErr
    )
    throw getDataErr
  }

  const runnerRequestId = get(
    jobRunDataSnap.val(),
    'runnerRequestMeta.requestId'
  )

  const [getRunnerDataErr, callRunnerRequestSnap] = await to(
    rtdbRef(`requests/callRunner/${runnerRequestId}`).once('value')
  )

  if (getRunnerDataErr) {
    console.error(
      `Error getting runner request: ${getRunnerDataErr.message || ''}`,
      getRunnerDataErr
    )
    throw getRunnerDataErr
  }

  const projectCreator = get(jobRunDataSnap.val(), 'createdBy')

  const callRunnerRequestCreator = get(callRunnerRequestSnap.val(), 'createdBy')
  const createdBy = projectCreator || callRunnerRequestCreator

  // Handle createdBy not being set on runnerRequest or test_run_meta
  if (!createdBy) {
    const missingCreatedByErr = `createdBy is not set on test_run_meta for "${projectId}/${jobRunKey}"`
    console.error(missingCreatedByErr)
    throw new Error(missingCreatedByErr)
  }

  // Request sendFcm function to send message to creator of run request
  const [writeErr] = await to(
    rtdbRef(`requests/sendFcm`).push({
      userId: createdBy,
      message: `Job Run completed with status: "${status}"`
    })
  )

  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }

  return null
}

/**
 * @name messageRunnerResult
 * Cloud Function triggered by Real Time Database Write Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/test_runs_meta/{projectId}/{jobRunKey}/runResult')
  .onWrite(messageRunnerResultEvent)
