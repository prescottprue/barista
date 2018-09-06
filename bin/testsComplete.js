#!/usr/bin/env node

const admin = require('firebase-admin')
const utils = require('../build/lib/utils')
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
    const runResult = data === '0' || data === 0 ? 'passed' : 'failed'
    console.log(`Writing status "${runResult}" to ${testMetaPath}`) // eslint-disable-line no-console
    return resultsRef
      .update({
        runResult,
        completedAt: admin.database.ServerValue.TIMESTAMP
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
  }
})
