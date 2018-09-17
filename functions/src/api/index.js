import express from 'express'
import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import controllers from './controllers'

const app = express()

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
// function validateFirebaseIdToken(req, res, next) {
//   console.log('Check if request is authorized with Firebase ID token')

//   if (
//     (!req.headers.authorization ||
//       !req.headers.authorization.startsWith('Bearer ')) &&
//     !(req.cookies && req.cookies.__session)
//   ) {
//     console.error(
//       'No Firebase ID token was passed as a Bearer token in the Authorization header.',
//       'Make sure you authorize your request by providing the following HTTP header:',
//       'Authorization: Bearer <Firebase ID Token>',
//       'or by passing a "__session" cookie.'
//     )
//     res.status(403).send('Unauthorized')
//     return
//   }

//   let idToken
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer ')
//   ) {
//     console.log('Found "Authorization" header')
//     // Read the ID Token from the Authorization header.
//     idToken = req.headers.authorization.split('Bearer ')[1]
//   } else if (req.cookies) {
//     console.log('Found "__session" cookie')
//     // Read the ID Token from cookie.
//     idToken = req.cookies.__session
//   } else {
//     // No cookie
//     res.status(403).send('Unauthorized')
//     return
//   }
//   admin
//     .auth()
//     .verifyIdToken(idToken)
//     .then(decodedIdToken => {
//       console.log('ID Token correctly decoded', decodedIdToken)
//       req.user = decodedIdToken
//       return next()
//     })
//     .catch(error => {
//       console.error('Error while verifying Firebase ID token:', error)
//       res.status(403).send('Unauthorized')
//     })
// }

app.use(cors({ origin: true }))
app.use(cookieParser())
// TODO: Uncomment this to apply the middleware for security
// app.use(validateFirebaseIdToken)
app.use(controllers)

// Route not found handler
app.use(function(req, res, next) {
  res.status(404).send('Not Found')
})

/**
 * @name api
 * Cloud Function triggered by HTTP request
 * @type {functions.CloudFunction}
 */
export default functions.https.onRequest(app)
