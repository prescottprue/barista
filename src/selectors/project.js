import { get, pickBy } from 'lodash'
import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { createSelector } from 'reselect'

export const getBuildStatuses = state =>
  state.firebase.data[CONTAINER_BUILDS_STATUS_PATH]

export const getProjectId = (state, props) => props.projectId

export const getProject = (state, props) =>
  get(state, `firestore.project.${props.projectid}`)

export const getMostRecentBuild = (state, props) =>
  get(state, `firestore.ordered.mostRecentBuild-${props.projectId}.0`)

export const getProjectRunsMeta = (state, props) =>
  get(state, `firebase.ordered.${props.projectId}-testRunsMeta`)

const getProjectRunsData = (state, props) =>
  get(state, `firebase.data.${props.projectId}-testRunsData`)

const getRunId = (state, props) => props.runId

export const getProjectRunMeta = createSelector(
  [getProjectRunsData, getRunId],
  (projectRunsMeta, runId) => get(projectRunsMeta, runId)
)

export const getProjectRunData = createSelector(
  [getProjectRunsData, getRunId],
  (projectRunsData, runId) => get(projectRunsData, runId)
)

export const getSuitesWithTests = createSelector(
  [getProjectRunData],
  projectRuns => pickBy(projectRuns, run => !!run.tests)
)

export const getProjectOrderedProjectRunsMeta = createSelector(
  [getProjectRunsMeta],
  projectRuns =>
    projectRuns &&
    projectRuns
      .reverse()
      .map(({ value: runData, key }) => ({ ...runData, key }))
)

export const getMostRecentBuildId = createSelector(
  [getMostRecentBuild],
  mostRecentBuild => get(mostRecentBuild, 'buildData.attributes.buildId')
)

export const getMostRecentBranchName = createSelector(
  [getMostRecentBuild],
  mostRecentBuild => get(mostRecentBuild, 'buildData.branchName')
)

export const getMostRecentCommitSha = createSelector(
  [getMostRecentBuild],
  mostRecentBuild => get(mostRecentBuild, 'buildData.commitSha')
)

export const getProjectImageBuildStatus = createSelector(
  [getBuildStatuses, getProjectId],
  (buildStatuses, projectId) => get(buildStatuses, `${projectId}`)
)
