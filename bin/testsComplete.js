#!/usr/bin/env node

const firebase = require('firebase')
const isString = require('lodash/isString')
const stdin = process.openStdin()

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

let data = ''

stdin.on('data', function(chunk) {
  data += chunk
})

stdin.on('end', function() {
  if (!process.env.JOB_RUN_KEY) {
    /* eslint-disable no-console */
    console.log(
      'JOB_RUN_KEY not found within environment, exiting with error status'
    )
    /* eslint-enable no-console */
    process.exit(1)
  } else {
    const useStage =
      isString(process.env.TEST_ARGS) &&
      process.env.TEST_ARGS.includes('useStage=true')
    initializeFirebase({ useStage })
    authWithFirebase().then(() => {
      const testMetaPath = `test_runs_meta/${process.env.JOB_RUN_KEY}`
      const resultsRef = firebase.database().ref(testMetaPath)
      const runResult = data === '0' || data === 0 ? 'passed' : 'failed'
      console.log(`Writing status "${runResult}" to ${testMetaPath}`) // eslint-disable-line no-console
      return resultsRef
        .update({
          runResult,
          completedAt: firebase.database.ServerValue.TIMESTAMP
        })
        .then(() => {
          process.exit()
        })
        .catch(err => {
          /* eslint-disable no-console */
          console.error(
            `Error writing status "${runResult}" to Firebase: ${err.message ||
              ''}`,
            err
          )
          /* eslint-enable no-console */
          process.exit(1)
        })
    })
  }
})
