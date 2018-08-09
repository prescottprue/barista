import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'

function parseMessageBody(message) {
  try {
    return message.json
  } catch (e) {
    console.error('PubSub message was not JSON', e)
    throw e
  }
}

/**
 * @param  {functions.Event} message - Cloud Pub Sub message
 * @return {Promise}
 */
async function callCloudBuildApiEvent(message) {
  if (!message.attributes) {
    const noAttrsMsg = 'no attributes in message'
    console.error(noAttrsMsg)
    throw new Error(noAttrsMsg)
  }
  const messageBody = parseMessageBody(message)
  if (!messageBody) {
    const noBodyMsg = 'The message does not have a body'
    console.error(noBodyMsg)
    throw new Error(noBodyMsg)
  }
  console.log('messageBody', messageBody, Object.keys(messageBody))
  const { attributes } = message
  const { status } = attributes
  const { source, sourceProvenance, finishTime } = messageBody
  const { branchName, projectId } = get(source, 'repoSource', {})
  const commitSha = get(sourceProvenance, 'resolvedRepoSource.commitSha', '')
  const buildData = { attributes, source, branchName, commitSha, finishTime }
  const statusRef = admin.database().ref(`image_build_statues/${projectId}`)
  // Write status updates to RTDB (Failures, New Builds, etc)
  const [statusSetErr] = await to(statusRef.set({ status, buildData }))
  if (statusSetErr) {
    console.error('Error setting status to RTDB')
    throw statusSetErr
  }
  // Exit for all status not a success (only successful builds written to
  // Firestore)
  if (status !== 'SUCCESS') {
    return null
  }

  // Write successful builds to container images collection
  const imageMetaRef = admin.firestore().collection('container_images')
  const [metaWriteErr] = await to(imageMetaRef.add({ projectId, buildData }))
  if (metaWriteErr) {
    console.error('Error image metadata to Firestore')
    throw metaWriteErr
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
