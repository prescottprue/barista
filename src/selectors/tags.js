import { get } from 'lodash'
import { TEST_GROUPS_DATA_PATH, TAGS_DATA_PATH } from 'constants'

/**
 * Test group data stored by key
 * @type Object
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getTestGroups(state, props) {
  return get(state, `firestore.data.${TEST_GROUPS_DATA_PATH}`)
}

/**
 * Ordered test group data
 * @type Array
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedTestGroups(state, props) {
  return get(state, `firestore.ordered.${TEST_GROUPS_DATA_PATH}`)
}

/**
 * Test group data stored by key
 * @type Object
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedTags(state, props) {
  return get(state, `firestore.ordered.${TAGS_DATA_PATH}`)
}

/**
 * Ordered test group data
 * @type Array
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getTags(state, props) {
  return get(state, `firestore.data.${TAGS_DATA_PATH}`)
}
