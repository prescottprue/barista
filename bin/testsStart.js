#!/usr/bin/env node
/* eslint-disable no-console */

const admin = require('firebase-admin')
const utils = require('./utils')

function writeStart() {
  const db = utils.initializeFirebase().database()
  if (!process.env.JOB_RUN_KEY) {
    console.log(
      'JOB_RUN_KEY not found within environment, exiting with error status'
    )
    process.exit(1)
  }
  return db
    .update({
      status: 'started',
      testsStartedAt: admin.database.ServerValue.TIMESTAMP
    })
    .then(() => {
      process.exit()
    })
    .catch(err => {
      console.error(
        `Error writing status "started" to Firebase: ${err.message || ''}`,
        err
      )
      process.exit(1)
    })
}

writeStart()
