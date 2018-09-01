import { initGA } from './analytics'
import { init as initErrorHandler } from './errorHandling'

/**
 * Log a message and return data passed. Useful for logging
 * messages within functional programming flows.
 * @param message - Message to log along with data.
 * @example Basic
 * import { flow, map as fpMap } from 'lodash'
 * const original = []
 * flow(
 *   fpLog('Before Map'),
 *   fpMap('branchName') // get branchName
 * )(original)
 * // => 'Before Map' [{ name: 'test' }]
 * // => 'After Map' ['test']
 */
export function fpLog(message) {
  return existing => {
    console.log(message, existing) // eslint-disable-line no-console
    return existing
  }
}

export const initScripts = () => {
  initGA()
  initErrorHandler()
}
