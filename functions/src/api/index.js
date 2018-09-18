import express from 'express'
import * as functions from 'firebase-functions'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import controllers from './controllers'

const app = express()

app.use(cors({ origin: true }))
app.use(cookieParser())
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
