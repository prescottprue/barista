#!/usr/bin/env node
/* eslint-disable no-console */
const glob = require('glob')
const path = require('path')
const admin = require('firebase-admin')
const utils = require('./utils')
const testFolderPath = path.join(__dirname, '..', 'cypress', 'integration')

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
  const filePaths = glob.sync(testFolderPath + '/**/**/*.spec.js', {
    cwd: __dirname
  })
  // Map paths into filenames
  const files = filePaths.map(
    fileName => fileName && fileName.replace(`${testFolderPath}/`, '')
  )
  console.log(`Writing test files data to Firestore`, files) // eslint-disable-line no-console
  const filesMetaPath = 'container_builds'
  const containerBuildRef = fbInstance
    .firestore()
    .collection(filesMetaPath)
    .doc(process.env.BUILD_ID)
  const containerBuildData = {
    files,
    filesAddedAt: admin.firestore.FieldValue.serverTimestamp()
  }
  // Query for existing container build with matching build id
  return containerBuildRef
    .get()
    .then(snap => {
      if (snap.exists) {
        console.log(
          'Matching doc found for container image:',
          process.env.BUILD_ID
        )
        // Update matching doc with files
        return containerBuildRef.update(containerBuildData)
      }

      // Add new document with buildId and files
      console.log('Creating new document for container build')
      containerBuildData.createdAt = admin.firestore.FieldValue.serverTimestamp()
      return containerBuildRef.set(containerBuildData, { merge: true })
    })
    .then(() => {
      console.log('Files data successfully written to Firestore')
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
