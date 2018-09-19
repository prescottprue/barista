import { get } from 'lodash'

/**
 * @param {Object} queryConfig - Configuration of query
 */
export function dataPathFromQuery(queryConfig) {
  return get(queryConfig, 'storeAs', get(queryConfig, 'collection'))
}
