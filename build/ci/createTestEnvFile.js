/* eslint-disable no-console */
import * as admin from 'firebase-admin'
import { pickBy, isUndefined, size, keys, isString } from 'lodash'
import fs from 'fs'
import path from 'path'
import rp from 'request-promise'
const testEnvFilePath = path.join(process.cwd(), 'cypress.env.json')
const localTestConfigPath = path.join(process.cwd(), 'cypress', 'config.json')
const serviceAccountPath = path.join(process.cwd(), 'serviceAccount.json')
const prefixesByCiEnv = {
  staging: 'STAGE_',
  production: 'PROD_'
}

/**
 * Get prefix for current environment based on environment vars available
 * within CI. Falls back to staging (i.e. STAGE)
 * @return {String} Environment prefix string
 */
function getEnvPrefix() {
  return (
    prefixesByCiEnv[process.env.CI_ENVIRONMENT_SLUG] || prefixesByCiEnv.staging
  )
}

/**
 * Get environment variable based on the current CI environment
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * envVarBasedOnCIEnv('FIREBASE_PROJECT_ID')
 * // => 'fireadmin-stage' (value of 'STAGE_FIREBASE_PROJECT_ID' environment var)
 */
function envVarBasedOnCIEnv(varNameRoot) {
  if (!process.env.CI && !process.env.CI_ENVIRONMENT_SLUG) {
    console.log(
      `Not within valid CI environment, ${varNameRoot} is being loaded from cypress/config.json`
    )
    const configObj = require(localTestConfigPath)
    return configObj[`STAGE_${varNameRoot}`] || configObj[varNameRoot]
  }
  const prefix = getEnvPrefix()
  return process.env[`${prefix}${varNameRoot}`] || process.env[varNameRoot]
}

/**
 * Get parsed value of environment variable. Useful for environment variables
 * which have characters that need to be escaped.
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * getParsedEnvVar('FIREBASE_PRIVATE_KEY_ID')
 * // => 'fireadmin-stage' (parsed value of 'STAGE_FIREBASE_PRIVATE_KEY_ID' environment var)
 */
function getParsedEnvVar(varNameRoot) {
  const val = envVarBasedOnCIEnv(varNameRoot)
  const prefix = getEnvPrefix()
  const combinedVar = `${prefix}${varNameRoot}`
  if (!val) {
    console.error(
      `${combinedVar} not found, make sure it is set within environment vars`
    )
  }
  try {
    if (isString(val)) {
      return JSON.parse(val)
    }
    return val
  } catch (err) {
    console.error(`Error parsing ${combinedVar}`)
    return val
  }
}

/**
 * Get service account from either local file or environment variables
 * @return {Object} Service account object
 */
function getServiceAccount() {
  // Check for local service account file (Local dev)
  if (fs.existsSync(serviceAccountPath)) {
    return require(serviceAccountPath)
  }
  // Use environment variables (CI)
  return {
    type: 'service_account',
    project_id: envVarBasedOnCIEnv('FIREBASE_PROJECT_ID'),
    private_key_id: envVarBasedOnCIEnv('FIREBASE_PRIVATE_KEY_ID'),
    private_key: getParsedEnvVar('FIREBASE_PRIVATE_KEY'),
    client_email: envVarBasedOnCIEnv('FIREBASE_CLIENT_EMAIL'),
    client_id: envVarBasedOnCIEnv('FIREBASE_CLIENT_ID'),
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: envVarBasedOnCIEnv('FIREBASE_CERT_URL')
  }
}

function identityToolkitUrl(resource = 'verifyCustomToken') {
  const fbClientApiKey = envVarBasedOnCIEnv('FIREBASE_API_KEY')
  if (!fbClientApiKey) {
    throw new Error(
      'FIREBASE_API_KEY not set within environment. Check cypress/config.json'
    )
  }
  const googleApiBaseUri =
    'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
  return `${googleApiBaseUri}/${resource}?key=${fbClientApiKey}`
}

async function identitytoolkitRequest({ token, resource, body }) {
  const fbClientApiKey = envVarBasedOnCIEnv('FIREBASE_API_KEY')
  const queryParams = { key: fbClientApiKey }
  try {
    const res = await rp({
      method: 'POST',
      uri: identityToolkitUrl(resource),
      json: true,
      qs: queryParams,
      body: body || { token }
    })
    return res
  } catch (err) {
    console.error(
      `Error in identity toolkit request for ${resource}: ${err.message || ''}`,
      err
    )
    throw err
  }
}

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function createTestConfig() {
  const envPrefix = getEnvPrefix()
  // Get UID from environment (falls back to cypress/config.json for local)
  const uid = envVarBasedOnCIEnv('TEST_UID')
  // Throw if UID is missing in environment
  if (!uid) {
    throw new Error(
      `${envPrefix}TEST_UID is missing from environment. Confirm that cypress/config.json contains either ${envPrefix}TEST_UID or TEST_UID.`
    )
  }

  // Get service account from local file falling back to environment variables
  const serviceAccount = getServiceAccount()

  // Confirm service account has all parameters
  const serviceAccountMissingParams = pickBy(serviceAccount, isUndefined)
  if (size(serviceAccountMissingParams)) {
    const errMsg = `Service Account is missing parameters: ${keys(
      serviceAccountMissingParams
    ).join(', ')}`
    throw new Error(errMsg)
  }

  // Get project ID from environment variable
  const projectId =
    process.env.GCLOUD_PROJECT || envVarBasedOnCIEnv('FIREBASE_PROJECT_ID')
  try {
    // Initialize Firebase app with service account
    const appFromSA = admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${projectId}.firebaseio.com`
      },
      'withServiceAccount'
    )
    // Create auth token
    const customToken = await appFromSA
      .auth()
      .createCustomToken(uid, { isTesting: true })

    console.log('Requesting to verify new custom token')
    const VERIFY_TOKEN_RESPONSE = await identitytoolkitRequest({
      token: customToken
    })
    const ACCOUNT_INFO_RESPONSE = await identitytoolkitRequest({
      token: customToken,
      body: { idToken: VERIFY_TOKEN_RESPONSE.idToken },
      resource: 'getAccountInfo'
    })
    // TODO: Call Google's verifyCustomToken endpoint and write the results to cypress.env.json
    // TODO: Call Google's getAccountInfo endpoint and write the results to cypress.env.json
    // Remove firebase app
    appFromSA.delete()
    // Create config object to be written into test env file
    const newCypressConfig = {
      TEST_UID: envVarBasedOnCIEnv('TEST_UID'),
      FIREBASE_API_KEY: envVarBasedOnCIEnv('FIREBASE_API_KEY'),
      FIREBASE_PROJECT_ID: envVarBasedOnCIEnv('FIREBASE_PROJECT_ID'),
      FIREBASE_AUTH_JWT: customToken,
      VERIFY_TOKEN_RESPONSE,
      ACCOUNT_INFO_RESPONSE
    }
    // Write config file as string
    fs.writeFileSync(testEnvFilePath, JSON.stringify(newCypressConfig, null, 2))
    return customToken
  } catch (err) {
    /* eslint-disable no-console */
    console.error(
      `Error generating custom token for uid: ${uid}`,
      err.message || err
    )
    /* eslint-enable no-console */
    return err
  }
}

;(async function() {
  try {
    await createTestConfig()
    process.exit()
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error creating auth token: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
