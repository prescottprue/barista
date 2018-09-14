import glob from 'glob'
import path from 'path'
import firebase from 'firebase'
import { isString } from 'lodash'
import config from '../../project.config'

const TEST_FOLDER_RELATIVE_PATH = path.join(config.e2eTestDir, 'integration')
const TEST_FOLDER_PATH = path.join(config.basePath, TEST_FOLDER_RELATIVE_PATH)
const CONTAINER_BUILDS_META_PATH = 'container_builds'

let firebaseInstance
export const stageFbConfig = {
  apiKey: 'AIzaSyD8UB1rOfw5oWzwyKrKvH0WLJ6wDPC94ac',
  authDomain: 'barista-stage.firebaseapp.com',
  databaseURL: 'https://barista-stage.firebaseio.com',
  projectId: 'barista-stage',
  storageBucket: 'barista-stage.appspot.com',
  messagingSenderId: '109344700598'
}

export const prodFbConfig = {
  apiKey: 'AIzaSyCiaUr9jIU_FdTKArOE0UsZq3K-ftChbLg',
  authDomain: 'barista-836b4.firebaseapp.com',
  databaseURL: 'https://barista-836b4.firebaseio.com',
  projectId: 'barista-836b4',
  storageBucket: 'barista-836b4.appspot.com',
  messagingSenderId: '438807155877'
}

/**
 * Initialize Firebase instance from service account (from local
 * serviceAccount.json)
 * @param {Object} reporterOptions - Options passed to the reporter
 * @param {Boolean} reporterOptions.useStage - Whether or not to use Barista stage environment
 * @return {Firebase} Initialized Firebase instance
 */
export function initializeFirebase({ useStage }) {
  try {
    if (!firebaseInstance) {
      firebaseInstance = firebase.initializeApp(
        useStage ? stageFbConfig : prodFbConfig
      )
    }
    return firebaseInstance
  } catch (err) {
    console.log('Error initializing firebase instance from service account.') // eslint-disable-line no-console
    throw err
  }
}

/**
 * Authenticate anonymously with Firebase
 */
export function authWithFirebase() {
  // Check to see if user is already authed
  if (firebase.auth().currentUser) {
    return Promise.resolve(firebase.auth().currentUser)
  }

  return new Promise((resolve, reject) => {
    // Attach auth state change listener that resolves promise after login
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        resolve(user)
      }
    })

    // Authenticate anonymously rejecting on failure
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        reject(error)
      })
  })
}

if (!process.env.BUILD_ID) {
  /* eslint-disable no-console */
  console.log(
    'BUILD_ID not found within environment, exiting with error status'
  )
  /* eslint-enable no-console */
  process.exit(1)
} else {
  const useStage =
    isString(process.env.TEST_ARGS) &&
    process.env.TEST_ARGS.includes('useStage=true')
  initializeFirebase({ useStage })
  authWithFirebase().then(() => {
    // Load all folders within dist directory (mirrors layout of src)
    const filePaths = glob.sync(TEST_FOLDER_PATH + '/**/**/*.spec.js', {
      cwd: __dirname
    })
    // Map paths into filenames
    const files = filePaths.map(
      fileName => fileName && fileName.replace(`${TEST_FOLDER_PATH}/`, '')
    )
    console.log(`Writing test files data to Firestore`, files) // eslint-disable-line no-console
    const containerBuildRef = firebase
      .firestore()
      .collection(CONTAINER_BUILDS_META_PATH)
      .doc(process.env.BUILD_ID)
    const containerBuildData = {
      files,
      filesAddedAt: firebase.firestore.FieldValue.serverTimestamp()
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
        containerBuildData.createdAt = firebase.firestore.FieldValue.serverTimestamp()
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
  })
}
