#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const drop = require('lodash/drop')
const isString = require('lodash/isString')
const fixturesPath = path.join(__dirname, '..', 'cypress', 'fixtures')
/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
function dataArrayFromSnap(snap) {
  const data = []
  if (snap.data && snap.exists) {
    data.push({ id: snap.id, data: snap.data() })
  } else if (snap.forEach) {
    snap.forEach(doc => {
      data.push({ id: doc.id, data: doc.data() || doc })
    })
  }
  return data
}
/**
 * Convert slash path to Firestore reference
 * @param  {firestore.Firestore} firestoreInstance - Instance on which to
 * create ref
 * @param  {String} slashPath - Path to convert into firestore refernce
 * @return {firestore.CollectionReference|firestore.DocumentReference}
 */
function slashPathToFirestoreRef(firestoreInstance, slashPath) {
  let ref = firestoreInstance
  const srcPathArr = slashPath.split('/')
  srcPathArr.forEach(pathSegment => {
    if (ref.collection) {
      ref = ref.collection(pathSegment)
    } else if (ref.doc) {
      ref = ref.doc(pathSegment)
    } else {
      throw new Error(`Invalid slash path: ${slashPath}`)
    }
  })
  return ref
}

function readJsonFixture(fixturePath) {
  const fixtureString = fs.readFileSync(fixturePath)
  try {
    return JSON.parse(fixtureString)
  } catch (err) {
    console.error(`Error reading JSON fixture at path: ${fixturePath}`)
    throw err
  }
}

function readFixture(fixturePath) {
  // Confirm fixture exists
  const pathToFixtureFile = path.join(fixturesPath, fixturePath)

  if (!fs.existsSync(pathToFixtureFile)) {
    throw new Error(`Fixture not found at path: ${fixturePath}`)
  }
  const fixtureFileExtension = path.extname(fixturePath)
  switch (fixtureFileExtension) {
    case '.json':
      return readJsonFixture(fixturePath)
    default:
      return fs.readFileSync(pathToFixtureFile)
  }
}

function getParsedArg(unparsed) {
  if (isString(unparsed)) {
    try {
      return JSON.parse(unparsed)
    } catch (err) {
      console.log('error parsing:', err)
      return unparsed
    }
  }
  return unparsed
}

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
function firestoreAction(action = 'set', actionPath, fixturePath, withMeta) {
  const fbInstance = utils.initializeFirebase()
  let ref = slashPathToFirestoreRef(fbInstance.firestore(), actionPath)

  // Confirm ref has action as a method
  if (typeof ref[action] !== 'function') {
    const missingActionErr = `Ref at provided path "${actionPath}" does not have action "${action}"`
    throw new Error(missingActionErr)
  }
  let fixtureData
  let options
  const parsedPath = getParsedArg(fixturePath)

  if (isString(parsedPath)) {
    fixtureData = readFixture(fixturePath)
    // Add meta if withMeta option exists
    if (withMeta) {
      const actionPrefix = action === 'update' ? 'updated' : 'created'
      fixtureData[`${actionPrefix}By`] = utils.envVarBasedOnCIEnv('TEST_UID')
      /* eslint-disable standard/computed-property-even-spacing */
      fixtureData[
        `${actionPrefix}At`
      ] = fbInstance.firestore.FieldValue.serverTimestamp()
      /* eslint-enable standard/computed-property-even-spacing */
    }
  } else {
    options = parsedPath
  }
  if (options && options.limit) {
    ref = ref.limit(options.limit)
  }
  try {
    // Call action with fixture data
    return ref[action](fixtureData).then(res => {
      const dataArray = dataArrayFromSnap(res)
      if (action === 'get') {
        process.stdout.write(JSON.stringify(dataArray))
      }
      return dataArray
    })
  } catch (err) {
    console.log(`Error with ${action} at path "${actionPath}": `, err)
    throw err
  }
}

const commands = [
  {
    command: 'firestore [action] [actionPath] [fixturePath]',
    describe: 'run action on Firebase using service account',
    builder: yargsInstance => {
      yargsInstance.positional('action', {
        describe: 'action to run on Firestore',
        default: 'set'
      })
      yargsInstance.positional('actionPath', {
        describe: 'path of action to run on Firestore',
        default: 'projects/test-project'
      })
      yargsInstance.positional('fixturePath', {
        describe: 'path of fixture to use ',
        default: 'fakeProject.json'
      })
    },
    handler: argv => {
      if (argv.verbose)
        console.info(
          `firestore command on :${argv.action} at ${argv.actionPath}`
        )
      return argv
    }
  }
]
;(function() {
  const yargs = require('yargs')
  let currentArgs
  try {
    // TODO: Replace with commandDir when moving config to a directory
    for (let command in commands) {
      currentArgs = yargs.command(command)
    }
    yargs.option('withMeta', {
      alias: 'm',
      default: false
    })
    /* eslint-disable no-unused-expressions */
    const argv = currentArgs.option('verbose', {
      alias: 'v',
      default: false
    }).argv
    return firestoreAction(...drop(argv._))
    /* eslint-enable no-unused-expressions */
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error running firebase action: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
