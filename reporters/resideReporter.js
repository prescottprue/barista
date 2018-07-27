const mocha = require('mocha')
const path = require('path')
const serviceAccountPath = path.join(process.cwd(), 'serviceAccount.json')
const serviceAccount = require(serviceAccountPath)
const admin = require('firebase-admin')
const { reduce, set, isFunction, isUndefined, forEach, get } = require('lodash')

const passed = 'passed'
const failed = 'failed'
const pending = 'pending'

const omitList = [
  'fn',
  'async',
  'sync',
  '_timeout',
  '_slow',
  '_enableTimeouts',
  'timedOut',
  '_trace',
  '_retries',
  '_currentRetry',
  'parent'
]

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://reside-dev-saunders.firebaseio.com`
})

function sanitizeTest(test, propList) {
  forEach(omitList, prop => {
    delete test[prop]
  })
  return reduce(
    test,
    (acc, value, key) => {
      if (isFunction(value)) {
        return acc
      }
      if (isUndefined(value)) {
        return set(acc, key, null)
      }
      return set(acc, key, value)
    },
    {}
  )
}
function writeToDatabase(dbRef, data) {
  return dbRef.update(data).catch(err => {
    console.log(`error writing data to Firebase at path: ${dbRef.path}`) // eslint-disable-line no-console
    return Promise.reject(err)
  })
}

module.exports = MyReporter

function MyReporter(runner) {
  const testJobKey = process.env.TEST_JOB_KEY || 'testJobKey'
  const dbRef = admin
    .database()
    .ref('test_results_data')
    .child(testJobKey)

  const metaRef = admin
    .database()
    .ref('test_results_meta')
    .child(testJobKey)

  mocha.reporters.Base.call(this, runner)

  let currentSuiteTitle = ''

  function getTestRef(test) {
    return dbRef.child(currentSuiteTitle).child(test.id)
  }

  runner.on('start', function() {
    writeToDatabase(metaRef, { status: pending, [pending]: true })
  })
  runner.on('end', async function() {
    const { passes, failures, end } = this.stats
    console.log('Test run end: %d/%d', passes, passes + failures) // eslint-disable-line no-console
    await metaRef
      .child('stats')
      .once('value')
      .then(testJobMetaStatsSnap => {
        const existingStats = testJobMetaStatsSnap.val()
        console.log('existingStats', existingStats)
        const newStats = reduce(
          this.stats,
          (stats, value, key) => {
            if (key === 'start') {
              return stats
            }
            if (key === 'end') {
              return set(stats, key, end)
            }
            return set(stats, key, value + get(existingStats, key, 0))
          },
          {}
        )
        writeToDatabase(metaRef.child('stats'), newStats).then(function() {
          const hasFailures =
            failures > 0 || get(existingStats, failures, 0) > 0
          console.log('hasFailures', hasFailures)
          if (hasFailures) {
            return writeToDatabase(metaRef, { status: failed, pending: false })
          } else {
            return writeToDatabase(metaRef, { status: passed, pending: false })
          }
        })
      })
  })

  // when the new test file is loaded
  runner.on('suite', function(suite) {
    if (suite.title) {
      currentSuiteTitle = suite.title
    }
  })
  runner.on('suite end', function() {
    currentSuiteTitle = ''
  })
  runner.on('test', function(test) {
    writeToDatabase(getTestRef(test), { state: 'pending' })
    writeToDatabase(metaRef, { pending: true })
  })
  runner.on('test end', function(test) {
    writeToDatabase(getTestRef(test), sanitizeTest(test))
  })

  runner.on('pass', function(test) {
    writeToDatabase(getTestRef(test), { state: 'pass' })
  })
  runner.on('fail', function(test, err) {
    writeToDatabase(getTestRef(test), { state: 'failed' })
    console.log('Test fail: %s -- error: %s', test.title, err.message)
  })
}
