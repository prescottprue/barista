#!/usr/bin/env node
/* eslint-disable no-console */

const admin = require('firebase-admin')
const utils = require('./utils')

var stdin = process.openStdin()

var data = ''

stdin.on('data', function(chunk) {
  data += chunk
})

stdin.on('end', function() {
  const db = utils.initializeFirebase().database()
  if (!process.env.JOB_RUN_KEY) {
    console.log(
      'JOB_RUN_KEY not found within environment, exiting with error status'
    )
    process.exit(1)
  } else {
    const testMetaPath = `test_runs_meta/${process.env.JOB_RUN_KEY}`
    const resultsRef = db.ref(testMetaPath)
    const status = data === '0' || data === 0 ? 'complete' : 'error'
    console(`Writing status "${status}" to ${testMetaPath}`)
    return resultsRef
      .update({
        status,
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        process.exit()
      })
      .catch(err => {
        console.error(
          `Error writing status "${status}" to Firebase: ${err.message || ''}`,
          err
        )
        process.exit(1)
      })
  }
})
