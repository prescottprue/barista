import { get } from 'lodash'
import { TAGS_DATA_PATH } from 'constants'

/**
 * Test tag ordered based on query config
 * @type Object
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedTags(state, props) {
  return get(state, `firestore.ordered.${TAGS_DATA_PATH}`)
}

/**
 * Test tag data stored by id from redux state
 * @type Array
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getTags(state, props) {
  return get(state, `firestore.data.${TAGS_DATA_PATH}`)
}

/**
 * Tag data from redux state
 * @type Array
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 * @param {Object} props.tagId - Id of tag
 */
export function getTag(state, props) {
  if (!props.tagId) {
    /* eslint-disable no-console */
    console.error(
      'tagId prop not found. Confirm component with getTestGroup recieves it.'
    )
    /* eslint-enable no-console */
  }
  return get(state, `firestore.data.${TAGS_DATA_PATH}.${props.tagId}`)
}
