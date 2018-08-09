import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// import { to } from 'utils/async'

/**
 * @param  {functions.Event} message - Cloud Pub Sub message
 * @return {Promise}
 */
async function callCloudBuildApiEvent(message) {
  console.log('cloud build event!!!')
  try {
    const messageBody = message.data
      ? Buffer.from(message.data, 'base64').toString()
      : null
    if (!message.attributes) {
      console.error('no attributes in message')
      throw new Error('No attributes in message')
    }
    console.log('messageBody', messageBody)
    const { attributes } = message
    console.log('attributes', attributes)
    if (attributes.status !== 'SUCCESS') {
      console.log('Build was unsuccessful, skipping')
      return null
    }
    await admin
      .database()
      .ref('image_builds_meta')
      .push({ attributes })
  } catch (e) {
    console.error('PubSub message was not JSON', e)
  }
}

/**
 * @name callCloudBuildApi
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.pubsub
  .topic('cloud-builds')
  .onPublish(callCloudBuildApiEvent)
