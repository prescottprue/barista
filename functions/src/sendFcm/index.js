import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'
import { getFirebaseConfig } from 'utils/firebaseFunctions'

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function sendFcmEvent(snap, context) {
  const {
    params: { pushId }
  } = context // contains auth and timestamp
  const { userId, message = '', title = 'Fireadmin' } = snap.val() || {}
  if (!userId) {
    throw new Error('userId is required')
  }
  const userRef = admin
    .firestore()
    .collection('users')
    .doc(userId)
  const callGoogleApiRequestRef = admin
    .database()
    .ref(`requests/callGoogleApi`)
    .push()
  const responseRef = admin.database().ref(`responses/${pushId}`)
  // Get user profile
  const userProfile = await userRef.get()
  const messagingToken = get(userProfile, 'messaging.mostRecentToken')
  const projectId = getFirebaseConfig()
  // Call Google API with message send
  callGoogleApiRequestRef.set({
    apiUrl: `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    method: 'POST',
    body: {
      message: {
        notification: {
          title,
          body: message
        },
        token: messagingToken
      }
    }
  })
  //
  const [writeErr, response] = await to(responseRef.set({ complete: true }))
  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }
  return response
}

/**
 * @name sendFcm
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/sendFcm/{pushId}')
  .onCreate(sendFcmEvent)
