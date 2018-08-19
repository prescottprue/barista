import { get } from 'lodash'
import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { createSelector } from 'reselect'

export const getBuildStatuses = state =>
  state.firebase.data[CONTAINER_BUILDS_STATUS_PATH]

export const getProjectId = (state, props) => props.projectid

export const getProject = (state, props) =>
  get(state, `firestore.project.${props.projectid}`)

export const getMostRecentBuild = (state, props) =>
  get(state, `firestore.ordered.mostRecentBuild-${props.projectId}.0`)

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
  (buildStatuses, projectId) => get(buildStatuses, projectId)
)
