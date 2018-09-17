import express from 'express'
import { hasAll } from 'utils'
import * as admin from 'firebase-admin'

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
  // const { uid: createdBy } = req.user
  console.log('report request:', { buildId, files, body: req.body })
  try {
    const containerBuildRef = admin
      .firestore()
      .collection(CONTAINER_BUILDS_META_PATH)
      .doc(process.env.BUILD_ID)
    const containerBuildData = {
      files,
      filesAddedAt: admin.firestore.FieldValue.serverTimestamp()
    }

    // Query for existing container build with matching build id
    const snap = await containerBuildRef.get()
    // Update existing container build doc if it exists
    if (snap.exists) {
      /* eslint-disable no-console */
      console.log(
        'Matching doc found for container image:',
        process.env.BUILD_ID
      )
      /* eslint-enable no-console */
      // Update matching doc with files
      return containerBuildRef.update(containerBuildData)
    }

    // Document does not exist, so create it  with buildId and files
    console.log('Creating new document for container build') // eslint-disable-line no-console
    containerBuildData.createdAt = admin.firestore.FieldValue.serverTimestamp()
    await containerBuildRef.set(containerBuildData, { merge: true })
    res.send(`Report received, thanks!`)
  } catch (err) {
    console.error(`Error in report request: ${err.message || ''}`, err)
    res.end(`Error!`)
  }
}

router.post('/updateFiles', handleFileUpdateRequest)

export default router
