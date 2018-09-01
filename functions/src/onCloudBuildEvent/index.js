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

async function updateContainerBuildStatus({ projectId, imageMetaData }) {
  const statusRef = admin
    .database()
    .ref(`${CONTAINER_BUILDS_STATUS_PATH}/${projectId}`)

  // Write status updates to RTDB (Failures, New Builds, etc)
  const [statusSetErr] = await to(
    statusRef.set({
      ...imageMetaData,
      updatedAt: admin.database.ServerValue.TIMESTAMP
    })
  )

  // Handle errors writing status update to RTDB
  if (statusSetErr) {
    console.error(
      `Error setting build event statues update to RTDB for project: "${projectId}"`,
      statusSetErr
    )
    throw statusSetErr
  }
  console.log('Successfully wrote status update of container build to RTDB')
}

async function updateContainerBuildMeta({ projectId, buildId, imageMetaData }) {
  // Write successful builds to container builds meta collection
  const containerBuildMeta = admin
    .firestore()
    .collection(CONTAINER_BUILDS_META_PATH)
    .doc(buildId)

  // Write container build metadata to Firestore
  const [imageMetaGetErr, imageMetaSnap] = await to(containerBuildMeta.get())

  // Handle errors getting image meta data from Firestore
  if (imageMetaGetErr) {
    console.error(
      'Error getting metadata of container build from Firestore: ',
      imageMetaGetErr
    )
    throw imageMetaGetErr
  }

  // Check for existing doc, if one does not exist, add createdAt otherwise add updatedAt
  if (!imageMetaSnap.exists) {
    console.log(
      'Metadata of container build does not already exist, adding createdAt'
    )
    imageMetaData.createdAt = admin.firestore.FieldValue.serverTimestamp()
  } else {
    imageMetaData.updatedAt = admin.firestore.FieldValue.serverTimestamp()
  }

  // Write image metadata to Firestore
  const [metaWriteErr] = await to(
    containerBuildMeta.set({ ...imageMetaData, projectId }, { merge: true })
  )

  // Handle errors writing image meta data to Firestore
  if (metaWriteErr) {
    console.error(
      'Error setting metadata of container build to Firestore: ',
      metaWriteErr
    )
    throw metaWriteErr
  }
  console.log('Successfully wrote metadata of container build to Firestore')
}

/**
 * Handle incoming PubSub message containing data about Cloud Build Event
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
  const { attributes } = message || {}
  const { status, buildId } = attributes || {}
  const { source, sourceProvenance } = messageBody
  const { branchName, repoName } = get(source, 'repoSource', {})
  const commitSha = get(sourceProvenance, 'resolvedRepoSource.commitSha', '')

  // Handle repo name not existing within message
  if (!repoName) {
    const noRepoErr = 'No repo name found in message body'
    console.error(noRepoErr, messageBody)
    throw new Error(noRepoErr)
  }
  // Strip prefix from repo name to get project (prefix is from cloud-build)
  const projectId = repoName.replace('github-reside-eng-', '')

  console.log(`Build event status update for project : "${projectId}"`, {
    status,
    branchName,
    commitSha
  })

  const imageMetaData = {
    status,
    branchName,
    buildId,
    commitSha,
    repoName: projectId
  }

  // Attach finishTime if it exists
  if (messageBody.finishTime) {
    imageMetaData.finishTime = messageBody.finishTime
  }

  try {
    // Update both status and build meta in parallel
    await Promise.all([
      updateContainerBuildStatus({ projectId, imageMetaData }),
      updateContainerBuildMeta({ projectId, buildId, imageMetaData })
    ])
  } catch (err) {
    console.error('Error in update of container build data:', err)
    throw err
  }

  // Log success and return null
  console.log(
    'Container Build Status and Metadata succesfully updated with Cloud Build Event data'
  )
  return null
}

/**
 * @name callCloudBuildApi
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.pubsub
  .topic('cloud-builds')
  .onPublish(callCloudBuildApiEvent)
