import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'

const projectId = Cypress.env('FIREBASE_PROJECT_ID')

const fbConfig = {
  apiKey: Cypress.env('FIREBASE_API_KEY'),
  authDomain: `${projectId}.firebaseapp.com`,
  databaseURL: `https://${projectId}.firebaseio.com`,
  projectId: `${projectId}`,
  storageBucket: `${projectId}.appspot.com`
}

firebase.initializeApp(fbConfig)

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  if (!Cypress.env('FIREBASE_AUTH_JWT')) {
    cy.log(
      'FIREBASE_AUTH_JWT must be set to cypress environment in order to login'
    )
    return
  }
  if (firebase.auth().currentUser) {
    cy.log('Current user already exists, login complete.')
  } else {
    cy.log('Current user does not already exist, logging in...')
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(auth => {
        if (auth) {
          resolve(auth)
        }
      })
      firebase
        .auth()
        .signInWithCustomToken(Cypress.env('FIREBASE_AUTH_JWT'))
        .then(() => {
          console.debug('Login command successful')
        })
        .catch(reject)
    })
  }
})
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
