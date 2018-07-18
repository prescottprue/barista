import * as admin from 'firebase-admin'
import { pickBy, isUndefined, size, keys } from 'lodash'
import fs from 'fs'
import path from 'path'

const prefixesByCiEnv = {
  staging: 'STAGE_',
  production: 'PROD_'
}

/**
 * Get environment variable based on the current CI environment
 * @param  {String} varNameSuffix - Name of the variable after the environment
 * prefix
 * @return {Any} Value of the environment variable
 * @example
 * envVarBasedOnCIEnv('FIREBASE_PROJECT_ID')
 * // => 'barista-stage' (value of 'STAGE_FIREBASE_PROJECT_ID' environment var)
 */
function envVarBasedOnCIEnv(varNameSuffix) {
  const prefix =
    prefixesByCiEnv[process.env.CI_ENVIRONMENT_SLUG] || prefixesByCiEnv.staging
  return process.env[`${prefix}${varNameSuffix}`]
}

function getServiceAccount() {
  const serviceAccountPath = path.join(process.cwd(), './serviceAccount.json')
  if (fs.existsSync(serviceAccountPath)) {
    return require(serviceAccountPath)
  }
  return {
    type: 'service_account',
    project_id: envVarBasedOnCIEnv('FIREBASE_PROJECT_ID'),
    private_key_id: envVarBasedOnCIEnv('FIREBASE_PRIVATE_KEY_ID'),
    private_key: envVarBasedOnCIEnv('FIREBASE_PRIVATE_KEY'),
    client_email: envVarBasedOnCIEnv('FIREBASE_CLIENT_EMAIL'),
    client_id: envVarBasedOnCIEnv('FIREBASE_CLIENT_ID'),
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: envVarBasedOnCIEnv('FIREBASE_CERT_URL')
  }
}

/**
 * @param  {functions.Event} event - Function event
 * @param {functions.Context} context - Functions context
 * @return {Promise}
 */
async function createAuthToken() {
  // Get UID from environment
  const uid = envVarBasedOnCIEnv('TEST_UID')
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
    appFromSA.delete()
    const newCypressConfig = {
      TEST_UID: '$STAGE_TEST_UID',
      TEST_PASSWORD: '$STAGE_TEST_PASSWORD',
      FIREBASE_API_KEY: '$STAGE_FIREBASE_API_KEY',
      FIREBASE_PROJECT_ID: '$STAGE_FIREBASE_PROJECT_ID',
      FIREBASE_AUTH_JWT: customToken
    }
    fs.writeFileSync(
      newCypressConfig,
      JSON.stringify(newCypressConfig, null, 2)
    )
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
    await createAuthToken()
    process.exit()
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error creating auth token: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
