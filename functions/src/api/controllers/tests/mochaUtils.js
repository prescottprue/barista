import Mocha from 'mocha'
import path from 'path'
import fs from 'fs'
import os from 'os'

const defaultMochaOptions = {
  timeout: 4000
  // grep: /area 1/, // only run tests containing certain
}

export function setupMochaRunner(mochaOpts = {}) {
  const mocha = new Mocha({ ...defaultMochaOptions, ...mochaOpts })

  const localDir = path.join(os.tmpdir(), 'repoSrc')

  // Add files
  // Maybe use glob?
  // Add each .js file to the mocha instance
  fs.readdirSync(localDir)
    .filter(function(file) {
      // Only keep the spec.js files
      return file.substr(-8) === '.spec.js'
    })
    .forEach(function(file) {
      console.log('Adding file:', path.join(localDir, file))
      mocha.addFile(path.join(localDir, file))
    })

  // Run Mocha
  return mocha
}

export function runMocha(mochaOpts = defaultMochaOptions) {
  const mocha = setupMochaRunner()

  // Run Mocha
  return new Promise((resolve, reject) => {
    const Runner = mocha.run(failures => {
      console.log('results:', failures)
      if (failures === 0) {
        console.log('no failures! tests pass!')
        resolve()
      } else {
        console.log('Error, tests failed!', failures)
        reject(failures)
      }
    })

    Runner.on('start', e => {
      console.log('test run started event', e.fullTitle())
      // e.title, e.parent, e.parent.tests
    })
    Runner.on('hook', e => {
      console.log('hook started event:', e.fullTitle())
    })
    Runner.on('hook end', e => {
      console.log('hook end event', e.fullTitle())
    })
    Runner.on('test', e => {
      console.log('test start event', e.fullTitle())
    })
    Runner.on('test end', e => {
      console.log('test end event', e.fullTitle())
    })
  })
}

export function countTests() {
  const mocha = setupMochaRunner({
    reporter: 'json'
  })

  // Run Mocha
  return new Promise((resolve, reject) => {
    const Runner = mocha.run(failures => {
      console.log('results:', failures)
      if (failures === 0) {
        console.log('no failures! tests pass!')
      } else {
        console.log('Error, tests failed!', failures)
        reject(failures)
      }
    })

    Runner.on('start', e => {
      console.log('test run started event', e.fullTitle(), e.parent.tests)
      // e.title, e.parent, e.parent.tests
      resolve(e.parent.tests.length)
    })
    // Runner.on('hook', e => {
    //   console.log('hook started event:', e.fullTitle())
    // })
    // Runner.on('hook end', e => {
    //   console.log('hook end event', e.fullTitle())
    // })
    // Runner.on('test', e => {
    //   console.log('test start event', e.fullTitle())
    // })
    // Runner.on('test end', e => {
    //   console.log('test end event', e.fullTitle())
    // })
  })
}
