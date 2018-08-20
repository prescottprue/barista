import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from 'utils/async'
import { callTestRunner } from 'utils/testRunner'
import { contextToAuthUid } from 'utils/firebaseFunctions'
import { rtdbRef } from 'utils/rtdb'
import { RESPONSES_PATH } from 'constants'

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
    timestamp
  } = context
  const eventData = snap.val()
  const {
    createdBy = uid,
    jobRunKey,
    environment,
    baristaProject,
    instanceTemplateName
  } = eventData
  const responseRef = rtdbRef(`${RESPONSES_PATH}/${CALL_RUNNER_PATH}/${pushId}`)

  // Write test run document to Firestore
  const [metaAddErr] = await to(
    admin
      .firestore()
      .collection('test_runs')
      .add({
        createdBy,
        createdAt: timestamp,
        meta: { callRunnerRequestId: pushId }
      })
  )

  // Handle errors writing test run document to firestore
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

  // Write success response to RTDB
  const [writeErr] = await to(
    responseRef.push({
      status: 'success',
      runStartResponse: testRunResponseSnap.val()
    })
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
