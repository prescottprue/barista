import express from 'express'
import * as admin from 'firebase-admin'
import { hasAll } from 'utils'
import { to } from 'utils/async'

const router = express.Router()
const CONTAINER_BUILDS_META_PATH = 'container_builds'

/**
 * Handle incomping report data from test runs
 * @param req - Express HTTP Request
 * @param res - Express HTTP Response
 */
export async function handleFileUpdateRequest(req, res) {
  const requiredKeys = ['buildId']
  if (!req.body || !hasAll(req.body, requiredKeys)) {
    return res
      .status(400)
      .send(`Body containing keys ${requiredKeys.join(', ')} required`)
  }
  const { buildId, files } = req.body
  console.log('file update request:', { buildId, files, body: req.body })
  const containerBuildRef = admin
    .firestore()
    .collection(CONTAINER_BUILDS_META_PATH)
    .doc(process.env.BUILD_ID)
  const containerBuildData = {
    files,
    filesAddedAt: admin.firestore.FieldValue.serverTimestamp()
  }

  // Query for existing container build with matching build id
  const [getErr, snap] = await to(containerBuildRef.get())

  // Handle errors getting container build doc
  if (getErr) {
    console.error(
      `Error updating container build meta document: ${getErr.message ||
        getErr}`
    )
    return res.status(400).send('Error saving to container build')
  }

  // Update existing container build doc if it exists
  if (snap.exists) {
    console.log('Matching doc found for container image:', process.env.BUILD_ID)

    // Update matching doc with files
    const [updateErr] = await to(containerBuildRef.update(containerBuildData))

    // Handle errors updating existing container build meta doc
    if (updateErr) {
      console.error(
        `Error updating container build meta document: ${updateErr.message ||
          updateErr}`
      )
      return res.status(400).send('Error saving to container build')
    }
  } else {
    // Document does not exist, so create it  with buildId and files
    console.log('Creating new document for container build') // eslint-disable-line no-console
    containerBuildData.createdAt = admin.firestore.FieldValue.serverTimestamp()

    // Create new container build meta doc
    const [createErr] = await to(
      containerBuildRef.set(containerBuildData, { merge: true })
    )

    // Handle errors creating new container build meta doc
    if (createErr) {
      console.error(
        `Error creating new container build meta document: ${createErr.message ||
          createErr}`
      )
      return res.status(400).send('Error saving to container build')
    }
  }

  // Response with success message
  return res.send('Report received, thanks!')
}

router.post('/updateFiles', handleFileUpdateRequest)

export default router
