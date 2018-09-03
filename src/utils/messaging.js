/* eslint-disable no-console */
import firebase from 'firebase/app'
import { actions as messageActions } from 'modules/notification'
import { publicVapidKey } from '../config'
import 'firebase/messaging'

function updateUserProfileWithToken(messagingToken) {
  const currentUserUid =
    firebase.auth().currentUser && firebase.auth().currentUser.uid
  if (!currentUserUid) {
    return
  }
  return firebase
    .firestore()
    .collection('users')
    .doc(currentUserUid)
    .update({
      messaging: {
        mostRecentToken: messagingToken,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    })
}

function getMessagingToken() {
  return firebase
    .messaging()
    .getToken()
    .then(refreshedToken => {
      console.log('Messaging Token Loaded', refreshedToken)
      return refreshedToken
    })
    .catch(err => {
      console.log('Unable to retrieve refreshed token ', err)
      return Promise.reject(err)
    })
}

function getTokenAndWriteToProfile() {
  return getMessagingToken().then(updateUserProfileWithToken)
}

export function requestPermission() {
  return firebase
    .messaging()
    .requestPermission()
    .then(() => {
      console.log('Notification permission granted, getting token...')
      return getTokenAndWriteToProfile()
    })
    .catch(err => {
      console.log('Unable to get permission to notify.', err)
      return Promise.reject(err)
    })
}

export function initializeMessaging(dispatch) {
  const messaging = firebase.messaging()
  // Add the public key generated from the console here.
  messaging.usePublicVapidKey(publicVapidKey)

  getTokenAndWriteToProfile()

  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(() => {
    getTokenAndWriteToProfile()
  })

  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(payload => {
    console.log('Message received. ', payload)
    messageActions.showSuccess('Message recieved')(dispatch)
    // Update the UI to include the received message.
    // appendMessage(payload)
  })

  requestPermission()
}
