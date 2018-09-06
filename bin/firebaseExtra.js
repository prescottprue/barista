#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const utils = require('../build/lib/utils')
const config = require('../project.config')

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
  const pathToFixtureFile = path.join(
    config.basePath,
    config.e2eTestDir,
    'fixtures',
    fixturePath
  )

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

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function firestoreAction({
  action = 'set',
  actionPath,
  fixturePath,
  withMeta
}) {
  const fbInstance = utils.initializeFirebase()
  const ref = utils.slashPathToFirestoreRef(fbInstance.firestore(), actionPath)

  // Confirm ref has action as a method
  if (typeof ref[action] !== 'function') {
    const missingActionErr = `Ref at provided path "${actionPath}" does not have action "${action}"`
    console.log(missingActionErr)
    throw new Error(missingActionErr)
  }

  const fixtureData = readFixture(fixturePath)

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

  try {
    // Call action with fixture data
    await ref[action](fixtureData)
    console.log(
      `action "${action}" at path "${actionPath}" successful with fixture: "${fixturePath}"`
    )
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
      return firestoreAction(argv)
    }
  }
]
;(async function() {
  const yargs = require('yargs')
  try {
    // TODO: Replace with commandDir when moving config to a directory
    for (let command in commands) {
      yargs.command(command)
    }
    yargs.option('withMeta', {
      alias: 'm',
      default: false
    })
    /* eslint-disable no-unused-expressions */
    yargs.option('verbose', {
      alias: 'v',
      default: false
    }).argv
    /* eslint-enable no-unused-expressions */
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error running firebase action: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
