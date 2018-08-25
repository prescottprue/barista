#!/usr/bin/env node
/* eslint-disable no-console */

const admin = require('firebase-admin')
const utils = require('./utils')

function writeStart() {
  const db = utils.initializeFirebase().database()
  if (!process.env.JOB_RUN_KEY) {
    const notFoundKeyMsg =
      'JOB_RUN_KEY not found within environment, exiting with error status'
    console.log(notFoundKeyMsg)
    return Promise.reject(notFoundKeyMsg)
  }
  console.log('Writing stared at time to database...')
  return db.update({
    testsStartedAt: admin.database.ServerValue.TIMESTAMP
  })
}

;(function() {
  writeStart()
    .then(() => {
      console.log('Started time successfully written to database...')
      process.exit()
    })
    .catch(err => {
      console.error(
        `Error writing status "started" to Firebase: ${err.message || ''}`,
        err
      )
      process.exit(1)
    })
})()
