#!/usr/bin/env node

const admin = require('firebase-admin')
const utils = require('./utils')
const stdin = process.openStdin()

let data = ''

stdin.on('data', function(chunk) {
  data += chunk
})

stdin.on('end', function() {
  const db = utils.initializeFirebase().database()
  if (!process.env.JOB_RUN_KEY) {
    /* eslint-disable no-console */
    console.log(
      'JOB_RUN_KEY not found within environment, exiting with error status'
    )
    /* eslint-enable no-console */
    process.exit(1)
  } else {
    const testMetaPath = `test_runs_meta/${process.env.JOB_RUN_KEY}`
    const resultsRef = db.ref(testMetaPath)
    const status = data === '0' || data === 0 ? 'complete' : 'error'
    console.log(`Writing status "${status}" to ${testMetaPath}`) // eslint-disable-line no-console
    return resultsRef
      .update({
        status,
        completedAt: admin.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        process.exit()
      })
      .catch(err => {
        /* eslint-disable no-console */
        console.error(
          `Error writing status "${status}" to Firebase: ${err.message || ''}`,
          err
        )
        /* eslint-enable no-console */
        process.exit(1)
      })
  }
})
