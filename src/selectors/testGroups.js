import { get } from 'lodash'
import { TEST_GROUPS_DATA_PATH } from 'constants'

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
 * @param {Object} props.testGroupId - Id of the test group
 */
export function getTestGroup(state, { testGroupId }) {
  if (!testGroupId) {
    /* eslint-disable no-console */
    console.warn(
      'testGroupId prop not found. Confirm component with getTestGroup recieves it.'
    )
    /* eslint-enable no-console */
  }
  return get(state, `firestore.data.${TEST_GROUPS_DATA_PATH}.${testGroupId}`)
}
