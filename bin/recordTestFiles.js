#!/usr/bin/env node
/* eslint-disable no-console */
const glob = require('glob')
const path = require('path')
const utils = require('./utils')
const testFolderPath = path.join(__dirname, '..', 'cypress', 'integration')

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
function dataArrayFromSnap(snap) {
  const data = []
  if (snap.data && snap.exists) {
    data.push({ id: snap.id, data: snap.data() })
  } else if (snap.forEach) {
    snap.forEach(doc => {
      data.push({ id: doc.id, data: doc.data() || doc })
    })
  }
  return data
}

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
  const filesMetaPath = `container_builds`
  const containerBuildsRef = fbInstance.firestore().collection(filesMetaPath)

  // Query for existing container build with matching build id
  return containerBuildsRef
    .where('buildData.attributes.buildId', '==', process.env.BUILD_ID)
    .get()
    .then(snap => {
      // Check results for matching doc
      const [matchingDoc] = dataArrayFromSnap(snap)

      if (matchingDoc) {
        console.log('Matching doc found for container image:', matchingDoc.id)
        // Update matching doc with files
        return containerBuildsRef.doc(matchingDoc.id).update({ files })
      }

      // Add new document with buildId and files
      console.log('Creating new document for container image files data')
      return containerBuildsRef.add({
        buildId: process.env.BUILD_ID,
        files,
        createdAt: fbInstance.firestore.FieldValue.serverTimestamp()
      })
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
