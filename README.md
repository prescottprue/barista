# Barista

[![Code Style][code-style-image]][code-style-url]
[![License][license-image]][license-url]

Mocha test running/reporting UI and API

## What?
1. Downloads test container image (similar to [this repo's e2e test Dockerfile][example-dockerfile-url]) based on settings passed to UI
1. Tests (Cypress and/or Mocha) run on [Google Compute Engine][compute-engine-url]
1. Results are reported back using [barista-reporter][barista-reporter-url] and [barista-tools][barista-tools-url]
1. Shows results in a clean interface (also available through API)

## Local Environment Setup
Before setting up make sure you have the following:
* Firebase Instance Config (from Firebase Console Authentication Tab)
* Google Cloud Service Account (from Firebase Console Authentication Tab or Google Cloud Console)

1. Make sure you have your node version set to a version of `8` (i.e. `8.11.3`)
1. Install dependencies: `npm i && npm i --prefix functions`

### React App
1. Create `src/config.js` that looks like so:
    ```js
    export const env = 'local' || process.env.NODE_ENV

    // Config for firebase
    export const firebase = {
      apiKey: "<- your firebase apiKey ->",
      authDomain: "<- your projectId ->.firebaseapp.com",
      databaseURL: "https://<- your projectId ->.firebaseio.com",
      projectId: "<- your projectId ->",
      storageBucket: "<- your projectId ->.appspot.com",
      messagingSenderId: "<- your messaging sender id ->"
    }

    // Config override for react-redux-firebase
    export const reduxFirebase = {

    }

    export const publicVapidKey = '<- your firebase messaging vapid key ->'

    export const googleApis = {
      apiKey: '<- your firebase apiKey ->'
    }

    export default { env, firebase, reduxFirebase }
    ```

### Cloud Functions
1. Download your project's service account and saved it to `serviceAccount.json`
1. Set your service account to your functions config by running the following:
    ```bash
    firebase use <-your projectId->
    firebase functions:config:set service_account="$(cat ./serviceAccount.json)" encryption.password="<- your pass ->"
    ```
1. Create `functions/.runtimeconfig.json` that looks like so:
    ```json
    {
      "encryption": {
        "password": "asdf"
      },
      "service_account": {
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "project_id": "<- your project id ->",
        "client_x509_cert_url": "<- your cert url ->",
        "client_id": "<- your client id ->",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "type": "service_account",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "private_key": "<- your private key ->",
        "private_key_id": "<- your private key id ->",
        "client_email": "<- your client_email ->"
      }
    }
    ```
**NOTE:** This file is ignored from git tracking. In a CI environment using `firebase-ci`. This is done so that environment specific settings can be applied.

### Tests
#### App E2E Tests
1. Download your project's service account and saved it to `serviceAccount.json`
1. Create `test/e2e/config.json` that looks like so:
    ```json
    {
      "FIREBASE_PROJECT_ID": "<- your projectId ->",
      "FIREBASE_API_KEY": "<- your firebase apiKey ->",
      "TEST_UID": "<- UID of qa@residebrokerage.com account ->"
    }
    ```

#### Cloud Functions Unit Tests

## Running Your Own

More on this coming soon.

## Why?
* Convient to run a subset of tests instead of all of them (Test Groups + Tags)
* Running tests at the click of a button requires "contained" running sessions (Compute Engine provides the ability to set specific resources)
* Tests are always updating and can live inside or outside of the source repo

## FAQ
1. Why not use the Cypress Dashboard?
    The Cypress Dashboard is specifically for **viewing** results of test runs. Barista allows for running tests remotley including only running certain tests (called Test Groups). Since Barista is open source you keep access to all of your test result.

## Special Thanks

Though [@prescottprue](https://github.com/prescottprue) came up with the original idea and prototype, it took tons of work from other folks to go from idea phase into a real project:

* [@urbantumbleweed](https://github.com/urbantumbleweed) - idea sharing, ticket/feature planning, and support on early prototyping
* [@reside-eng](https://github.com/reside-eng) - Providing a supportive environment for growth of open source tools

[license-url]: https://github.com/reside-eng/barista/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
[compute-engine-url]: https://console.cloud.google.com/compute
[example-dockerfile-url]: https://github.com/reside-eng/barista/blob/master/test/e2e/Dockerfile
[barista-reporter-url]: https://github.com/reside-eng/barista-reporter
[barista-tools]: https://github.com/prescottprue/barista-tools