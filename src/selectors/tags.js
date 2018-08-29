import { get } from 'lodash'
import { firestorePaths, TAGS_DATA_PATH } from 'constants'

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedTagGroups(state, props) {
  return get(state, `firestore.ordered.${firestorePaths.tagGroups}`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getTagGroups(state, props) {
  return get(state, `firestore.data.${firestorePaths.tagGroups}`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedTags(state, props) {
  return get(state, `firestore.ordered.${TAGS_DATA_PATH}`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getTags(state, props) {
  return get(state, `firestore.data.${TAGS_DATA_PATH}`)
}
