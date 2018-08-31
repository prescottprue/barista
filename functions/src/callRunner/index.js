import * as functions from 'firebase-functions'
import { to } from 'utils/async'
import { callTestRunner } from 'utils/testRunner'
import { contextToAuthUid } from 'utils/firebaseFunctions'
import { rtdbRef } from 'utils/rtdb'
import { RESPONSES_PATH } from 'constants'
import { get } from 'lodash'

const CALL_RUNNER_PATH = 'callRunner'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function callRunnerEvent(snap, context) {
  const uid = contextToAuthUid(context)
  const {
    params: { pushId },
    timestamp: requestCreatedAt
  } = context
  const eventData = snap.val()
  const {
    createdBy = uid,
    jobRunKey,
    environment,
    baristaProject,
    instanceTemplateName,
    commandArgsStr,
    buildId
  } = eventData
  const responseRef = rtdbRef(`${RESPONSES_PATH}/${CALL_RUNNER_PATH}/${pushId}`)
  const metaRef = rtdbRef(`test_runs_meta/${baristaProject}/${jobRunKey}`)

  // Write runnerRequestMeta to test_run_meta in RTDB
  const [metaAddErr] = await to(
    metaRef.update({
      runnerRequestMeta: { requestId: pushId, requestCreatedAt }
    })
  )

  // Handle errors writing runnerRequestMeta to test_run_meta in RTDB
  if (metaAddErr) {
    console.error(
      `Error writing metadata to Firestore: ${metaAddErr.message || ''}`,
      metaAddErr
    )
    throw metaAddErr
  }

  // Call to start test run (calls callGoogleApi function)
  const [runErr, testRunResponseSnap] = await to(
    callTestRunner({
      requestId: pushId,
      jobRunKey,
      createdBy,
      environment,
      baristaProject,
      commandArgsStr,
      meta: { jobRunKey },
      instanceTemplateName
    })
  )

  // Handle errors starting test run
  if (runErr) {
    console.error(`Error writing response: ${runErr.message || ''}`, runErr)

    // Write error to response object within RTDB
    const [runErrWriteErr] = await to(
      responseRef.push({ status: 'error', error: runErr.message || 'Error' })
    )

    // Handle errors writing error back to response object within RTDB
    if (runErrWriteErr) {
      console.error(
        `Error writing error data to RTDB: ${runErrWriteErr.message || ''}`,
        runErrWriteErr
      )
      throw runErrWriteErr
    }

    // Throw out of the function with original error
    throw runErr
  }
  const responseData = get(testRunResponseSnap.val(), 'responseData', {})
  const targetLink = get(responseData, 'targetLink', '')
  const resourceUrl = targetLink.replace(
    'https://www.googleapis.com/compute/v1/',
    ''
  )
  const [, , , zone, , id] = resourceUrl.split('/')
  const instanceMeta = {
    resourceUrl,
    zone,
    id,
    targetLink,
    createdBy: responseData.user || null,
    buildId
  }
  const [writeErr] = await to(
    Promise.all([
      // Write success response to RTDB
      responseRef.update({
        status: 'success',
        runStartResponse: testRunResponseSnap.val()
      }),
      // Update instanceMeta parameter on test_run_meta object
      metaRef.child(instanceMeta).update(instanceMeta)
    ])
  )

  // Handle errors writing response to RTDB
  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }

  console.log('Request completed successfully, exiting.')

  return null
}

/**
 * @name callRunner
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/callRunner/{pushId}')
  .onCreate(callRunnerEvent)
