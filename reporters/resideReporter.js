const mocha = require('mocha')
const path = require('path')
const serviceAccountPath = path.join(process.cwd(), 'serviceAccount.json')
const serviceAccount = require(serviceAccountPath)
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://reside-dev-saunders.firebaseio.com`
})

function writeToDatabase(dbRef, data) {
  return dbRef.update(data).catch(err => {
    console.log(`error writing data to Firebase at path: ${dbRef.path}`)
    return Promise.reject(err)
  })
}

module.exports = MyReporter

function MyReporter(runner) {
  const dbRef = admin
    .database()
    .ref('test_results_data')
    .push()

  mocha.reporters.Base.call(this, runner)
  let self = this
  let passes = 0
  let failures = 0
  let currentTestIndex = 0
  let total = runner.total

  function getCurrentTestRef() {
    return dbRef.child('tests').child(currentTestIndex)
  }

  runner.on('start', function(test) {
    console.log('Start test run. Total tests: %s', total)
    console.log('******************Test - start', test)
    return writeToDatabase(dbRef.child('start'), { total })
  })

  runner.on('pass', function(test) {
    console.log('******************Test - pass', test)
    const passRef = getCurrentTestRef().child('pass')
    passes++
    currentTestIndex++
    return writeToDatabase(passRef, clean(test))
  })

  runner.on('fail', function(test, err) {
    console.log('******************Test - fail', test)
    const failRef = getCurrentTestRef().child('fail')
    failures++
    currentTestIndex++
    console.log('Test fail: %s -- error: %s', test.fullTitle(), err.message)
    return writeToDatabase(failRef, clean(test))
  })

  runner.once('end', function() {
    console.log('Test run end: %d/%d', passes, passes + failures)
    writeToDatabase(dbRef.child('end'), {
      failures,
      passes,
      total,
      stats: self.stats
    })
  })
}

/**
 * Return a plain-object representation of `test`
 * free of cyclic properties etc.
 *
 * @api private
 * @param {Object} test
 * @return {Object}
 */
function clean(test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    currentRetry: test.currentRetry()
  }
}

mocha.utils.inherits(MyReporter, mocha.reporters.Spec)
