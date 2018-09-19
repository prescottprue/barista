import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { containerBuildsMetaQuery } from 'queryConfigs'
import { dataPathFromQuery } from 'utils/queries'

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
  const dataPath = dataPathFromQuery(containerBuildsMetaQuery(props))
  return state.firestore.data[dataPath]
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedBuilds(state, props) {
  const dataPath = dataPathFromQuery(containerBuildsMetaQuery(props))
  return state.firestore.ordered[dataPath]
}
