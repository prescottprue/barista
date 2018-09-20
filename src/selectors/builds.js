import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { containerBuildsMetaQuery } from 'queryConfigs'
import { dataPathFromQuery } from 'utils/queries'
import { get } from 'lodash'
import {
  flow,
  map as fpMap,
  uniq as fpUniq,
  flatten as fpFlatten,
  filter as fpFilter,
  mapValues as fpMapValues,
  groupBy as fpGroupBy
} from 'lodash/fp'
import { createSelector } from 'reselect'

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

/**
 * Get filenames grouped by project id from builds
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getFilenamesGroupedByProjectId = createSelector(
  [getOrderedBuilds],
  orderedBuilds => {
    const getUniqueFilenamesFromBuild = flow(
      fpMap('files'), // get files from each build
      fpFlatten, // flatten array of files arrays into a single array
      fpUniq // remove duplicates
    )
    return flow(
      // Filter to builds with files and a projectId
      fpFilter(
        build => get(build, 'files', []).length && !!get(build, 'projectId')
      ),
      // Group into object by projectId
      fpGroupBy('projectId'),
      // Map each project's list of builds into a list of unique filenames
      fpMapValues(getUniqueFilenamesFromBuild)
    )(orderedBuilds || [])
  }
)
