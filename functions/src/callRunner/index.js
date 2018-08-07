import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { to } from 'utils/async'
import { startTestRun } from 'utils/testRunner'

function rtdbRef(refPath) {
  return admin.database().ref(refPath)
}

function contextToAuthUid(functionContext) {
  if (functionContext.authType === 'ADMIN') {
    return 'admin'
  }
  if (functionContext.authType === 'USER') {
    return functionContext.auth.uid
  }
  return 'Unknown'
}

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
  const { projectId, environment, createdBy = uid } = eventData
  const responseRef = rtdbRef(`responses/callRunner/${pushId}`)

  // Handle request missing required params
  if (!projectId || !environment) {
    const missingParamsMsg = 'projectId and environment are required'
    console.error(missingParamsMsg)

    // Write error to response object within RTDB
    const [missingParamsErrWrite] = await to(
      responseRef.push({ status: 'error', error: missingParamsMsg })
    )

    // Handle errors writing error back to response object within RTDB
    if (missingParamsErrWrite) {
      console.error(
        `Error writing error data to RTDB: ${missingParamsErrWrite.message ||
          ''}`,
        missingParamsErrWrite
      )
      throw missingParamsErrWrite
    }
    throw new Error(missingParamsMsg)
  }

  // Write test run document to Firestore
  const [metaAddErr] = await to(
    admin
      .firestore()
      .collection('test_runs')
      .add({
        createdBy,
        createdAt: timestamp,
        meta: { callRunnerRequestId: pushId, projectId, environment }
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
  const [runErr] = await to(
    startTestRun({ environment, projectId, resultsId: pushId, createdBy })
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
  const [writeErr, response] = await to(responseRef.push({ status: 'success' }))

  // Handle errors writing response to RTDB
  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }

  return response
}

/**
 * @name callRunner
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/callRunner/{pushId}')
  .onCreate(callRunnerEvent)
