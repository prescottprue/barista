#!/usr/bin/env node

const admin = require('firebase-admin')
const utils = require('./utils')

function writeStart() {
  const db = utils.initializeFirebase().database()
  if (!process.env.JOB_RUN_KEY) {
    const notFoundKeyMsg =
      'JOB_RUN_KEY not found within environment, exiting with error status'
    console.log(notFoundKeyMsg) // eslint-disable-line no-console
    return Promise.reject(notFoundKeyMsg)
  }
  console.log('Writing stared at time to database...') // eslint-disable-line no-console
  return db.update({
    testsStartedAt: admin.database.ServerValue.TIMESTAMP
  })
}

;(function() {
  writeStart()
    .then(() => {
      console.log('Started time successfully written to database...') // eslint-disable-line no-console
      process.exit()
    })
    .catch(err => {
      /* eslint-disable no-console */
      console.error(
        `Error writing status "started" to Firebase: ${err.message || ''}`,
        err
      )
      /* eslint-enable no-console */
      process.exit(1)
    })
})()
