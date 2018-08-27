import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { get } from 'lodash'
import { to } from 'utils/async'
import {
  CONTAINER_BUILDS_META_PATH,
  CONTAINER_BUILDS_STATUS_PATH
} from 'constants'

/**
 * Parse message body from message into JSON handling errors
 * @param  {Object} message - Message object from pubsub containing json
 * parameter with body of message
 * @return {Object}
 */
function parseMessageBody(message) {
  try {
    return message.json
  } catch (e) {
    console.error('PubSub message was not JSON and an error was thrown: ', e)
    return null
  }
}

/**
 * @param  {functions.Event} message - Cloud Pub Sub message
 * @return {Promise}
 */
async function callCloudBuildApiEvent(message) {
  // Handle message object not containing attributes
  if (!message.attributes) {
    const noAttrsMsg = 'No attributes in message'
    console.error(noAttrsMsg)
    throw new Error(noAttrsMsg)
  }

  // Parse message body from message into JSON
  const messageBody = parseMessageBody(message)

  // Handle message not having a body
  if (!messageBody) {
    const noBodyMsg = 'The message does not have a body'
    console.error(noBodyMsg)
    throw new Error(noBodyMsg)
  }

  // Get info from message
  const { attributes } = message
  const { status } = attributes
  const { source, sourceProvenance } = messageBody
  const { branchName, repoName } = get(source, 'repoSource', {})
  const commitSha = get(sourceProvenance, 'resolvedRepoSource.commitSha', '')
  const buildData = { attributes, source, branchName, commitSha }
  if (!repoName) {
    const noRepoErr = 'No repo name found in message body'
    console.error(noRepoErr, messageBody)
    throw new Error(noRepoErr)
  }
  // Strip prefix from repo name to get project (prefix is from cloud-build)
  const projectId = repoName.replace('github-reside-eng-', '')

  console.log(`Build event status update for project: "${projectId}"`, {
    branchName,
    commitSha
  })

  const statusRef = admin
    .database()
    .ref(`${CONTAINER_BUILDS_STATUS_PATH}/${projectId}`)

  // Write status updates to RTDB (Failures, New Builds, etc)
  const [statusSetErr] = await to(
    statusRef.set({ status, branchName, buildData })
  )

  // Handle errors writing status update to RTDB
  if (statusSetErr) {
    console.error(
      `Error setting build event statues update to RTDB for project: "${projectId}"`,
      statusSetErr
    )
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

  // Write image metadata to Firestore
  const [metaWriteErr] = await to(imageMetaRef.add(imageMetaData))

  // Handle errors writing image meta data to Firestore
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
