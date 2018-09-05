import { get, pickBy, reduce } from 'lodash'
import {
  flow,
  map as fpMap,
  filter as fpFilter,
  uniq as fpUniq,
  sortBy as fpSortBy
} from 'lodash/fp'
import { PROJECTS_DATA_PATH, CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { createSelector } from 'reselect'
import { getBuildStatuses } from './builds'
import { addDurationToNow, strictDistanceInWords } from 'utils/formatters'

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjectId(state, props) {
  return props.projectId
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProject(state, props) {
  return get(state, `firestore.${PROJECTS_DATA_PATH}.${props.projectid}`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getMostRecentBuild(state, props) {
  return get(state, `firestore.ordered.mostRecentBuild-${props.projectId}.0`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjectRunsMeta(state, props) {
  return get(state, `firebase.ordered.${props.projectId}-testRunsMeta`)
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjectRunsMetaData(state, props) {
  return get(state, `firebase.data.${props.projectId}-testRunsMeta`)
}

/**
 * Get data (test_runs_data) for project runs
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
function getProjectRunsData(state, props) {
  return get(state, `firebase.data.${props.projectId}-testRunsData`)
}

/**
 * Get runId from props
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
function getRunId(state, props) {
  return props.runId
}

/**
 * Get the meta data for a specific run within a project
 * @param {*} state
 * @param {*} props
 * @param {String} props.runId
 */
export const getProjectRunMeta = createSelector(
  [getProjectRunsMetaData, getRunId],
  (projectRunsMeta, runId) => get(projectRunsMeta, runId)
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getProjectRunData = createSelector(
  [getProjectRunsData, getRunId],
  (projectRunsData, runId) => get(projectRunsData, runId)
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getSuitesWithTests = createSelector(
  [getProjectRunData],
  projectRuns => pickBy(projectRuns, run => !!run.tests)
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getProjectOrderedProjectRunsMeta = createSelector(
  [getProjectRunsMeta],
  projectRuns =>
    projectRuns &&
    projectRuns
      .reverse()
      .map(({ value: runData, key }) => ({ ...runData, key }))
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getMostRecentBuildId = createSelector(
  [getMostRecentBuild],
  mostRecentBuild =>
    get(
      mostRecentBuild,
      'id',
      // TODO: Remove once old container images have been updated
      get(mostRecentBuild, 'buildData.attributes.buildId')
    )
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getMostRecentBranchName = createSelector(
  [getMostRecentBuild],
  mostRecentBuild =>
    get(
      mostRecentBuild,
      'branchName',
      get(mostRecentBuild, 'buildData.branchName')
    )
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getMostRecentCommitSha = createSelector(
  [getMostRecentBuild],
  mostRecentBuild =>
    get(
      mostRecentBuild,
      'commitSha',
      get(mostRecentBuild, 'buildData.commitSha')
    )
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getProjectImageBuildStatus = createSelector(
  [getBuildStatuses, getProjectId],
  (buildStatuses, projectId) => get(buildStatuses, `${projectId}`)
)

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getProjectBuilds(state, props) {
  return state.firestore.data[`builds-${props.projectId}`]
}

/**
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getOrderedProjectBuilds(state, props) {
  return state.firestore.ordered[`builds-${props.projectId}`]
}

/**
 * Get a list of branch names from all of the container builds
 * for the current project. TODO: Replace this with a selector
 * at the new path once onCloudBuildEvent cloud function handles
 * writing branches.
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export const getProjectBranchNames = createSelector(
  [getOrderedProjectBuilds],
  (orderedBuilds, projectId) => {
    const branchNamesOrderedByDefault = flow(
      fpFilter('branchName'), // filter to project with branchName
      fpMap('branchName'), // map objects to branchNames
      fpUniq, // remove duplicates
      fpSortBy(branchName => branchName !== 'master') // place master at the top
    )(orderedBuilds || [])
    return branchNamesOrderedByDefault && branchNamesOrderedByDefault.length
      ? branchNamesOrderedByDefault
      : ['master']
  }
)

export const getRunBuildId = createSelector([getProjectRunMeta], runMeta =>
  get(runMeta, 'instanceMeta.buildId', '')
)

/**
 * Selector when there is only one build item that should be returned
 * @export
 * @param {Object} state - Redux state (from connect)
 * @param {Object} props - Component props
 */
export function getRunBuildData(state, props) {
  return reduce(
    get(state, `firestore.data.buildId${props.runId}`, {}),
    (acc, buildData, key) => ({ ...buildData, key }),
    {}
  )
}

export const getRunDurationWords = createSelector(
  [getProjectRunMeta],
  runMeta => {
    const durationMilliseconds = get(runMeta, 'stats.duration', 0)
    return strictDistanceInWords(addDurationToNow(durationMilliseconds))
  }
)
