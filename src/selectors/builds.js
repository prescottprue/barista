import {
  CONTAINER_BUILDS_STATUS_PATH,
  CONTAINER_BUILDS_META_PATH
} from 'constants'

/**
 * Get status of container image build
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getBuildStatuses(state) {
  return state.firebase.data[CONTAINER_BUILDS_STATUS_PATH]
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getBuilds(state, props) {
  return state.firestore.ordered[CONTAINER_BUILDS_META_PATH]
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedBuilds(state, props) {
  return state.firestore.ordered[CONTAINER_BUILDS_META_PATH]
}
