import { get, pickBy } from 'lodash'
import { PROJECTS_DATA_PATH } from 'constants'
import { createSelector } from 'reselect'
import { getBuildStatuses } from './builds'

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
