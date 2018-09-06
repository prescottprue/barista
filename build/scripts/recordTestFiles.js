import glob from 'glob'
import path from 'path'
import admin from 'firebase-admin'
import utils from '../lib/utils'
import config from '../../project.config'

const TEST_FOLDER_RELATIVE_PATH = path.join(config.e2eTestDir, 'integration')
const TEST_FOLDER_PATH = path.join(config.basePath, TEST_FOLDER_RELATIVE_PATH)
const CONTAINER_BUILDS_META_PATH = 'container_builds'

if (!process.env.BUILD_ID) {
  /* eslint-disable no-console */
  console.log(
    'BUILD_ID not found within environment, exiting with error status'
  )
  /* eslint-enable no-console */
  process.exit(1)
} else {
  const fbInstance = utils.initializeFirebase()
  // Load all folders within dist directory (mirrors layout of src)
  const filePaths = glob.sync(TEST_FOLDER_PATH + '/**/**/*.spec.js', {
    cwd: __dirname
  })
  // Map paths into filenames
  const files = filePaths.map(
    fileName => fileName && fileName.replace(`${TEST_FOLDER_PATH}/`, '')
  )
  console.log(`Writing test files data to Firestore`, files) // eslint-disable-line no-console
  const containerBuildRef = fbInstance
    .firestore()
    .collection(CONTAINER_BUILDS_META_PATH)
    .doc(process.env.BUILD_ID)
  const containerBuildData = {
    files,
    filesAddedAt: admin.firestore.FieldValue.serverTimestamp()
  }

  // Query for existing container build with matching build id
  containerBuildRef
    .get()
    .then(snap => {
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
      return containerBuildRef.set(containerBuildData, { merge: true })
    })
    .then(() => {
      console.log('Files data successfully written to Firestore') // eslint-disable-line no-console
      process.exit()
    })
    .catch(err => {
      /* eslint-disable no-console */
      console.error(
        `Error writing files list to Firestore: ${err.message || ''}`,
        err
      )
      /* eslint-enable no-console */
      process.exit(1)
    })
}
