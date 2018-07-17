import crypto from 'crypto'
import { isString, get } from 'lodash'
import * as functions from 'firebase-functions'

export const encrypt = (text, options = {}) => {
  const { algorithm = 'aes-256-ctr', password } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const cipherPass = password || get(functions.config(), 'encryption.password')
  if (!cipherPass) {
    const missingPassMsg =
      'Password required to encrypt. Check that encryption.password is set in Cloud Functions environment'
    console.error(missingPassMsg)
    throw new Error(missingPassMsg)
  }
  const cipher = crypto.createCipher(algorithm, cipherPass)
  let crypted = cipher.update(str, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = (text, options = {}) => {
  const { algorithm = 'aes-256-ctr', password } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const cipherPass = password || get(functions.config(), 'encryption.password')
  if (!cipherPass) {
    const missingPassMsg =
      'Password required to encrypt. Check that encryption.password is set in Cloud Functions environment'
    console.error(missingPassMsg)
    throw new Error(missingPassMsg)
  }
  const decipher = crypto.createDecipher(algorithm, cipherPass)
  let dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export default { encrypt, decrypt }
