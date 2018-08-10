import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'
import {
  CONTAINER_BUILDS_META_PATH,
  CONTAINER_BUILDS_STATUS_PATH
} from 'constants'

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
  const { source, sourceProvenance } = messageBody
  const { branchName, projectId } = get(source, 'repoSource', {})
  const commitSha = get(sourceProvenance, 'resolvedRepoSource.commitSha', '')
  const buildData = { attributes, source, branchName, commitSha }
  const statusRef = admin
    .database()
    .ref(`${CONTAINER_BUILDS_STATUS_PATH}/${projectId}`)
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
  const imageMetaData = { projectId, buildData }
  if (messageBody.finishTime) {
    imageMetaData.finishTime = messageBody.finishTime
  }
  // Write successful builds to container images collection
  const imageMetaRef = admin.firestore().collection(CONTAINER_BUILDS_META_PATH)
  const [metaWriteErr] = await to(imageMetaRef.add(imageMetaData))
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
