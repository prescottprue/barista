import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import {
  CONTAINER_BUILDS_META_PATH,
  CONTAINER_BUILDS_STATUS_PATH,
  paths
} from 'constants'
import { setPropTypes } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import styles from './MostRecentImageInfo.styles'
import {
  getMostRecentCommitSha,
  getMostRecentBranchName,
  getMostRecentBuildId,
  getProjectImageBuildStatus
} from 'selectors'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired
  }),
  firestoreConnect(({ projectId }) => [
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime'],
      limit: 1,
      storeAs: `mostRecentBuild-${projectId}`
    }
  ]),
  firebaseConnect([
    {
      path: CONTAINER_BUILDS_STATUS_PATH
    }
  ]),
  // map redux state to props
  connect((state, props) => ({
    branchName: getMostRecentBranchName(state, props),
    commitSha: getMostRecentCommitSha(state, props),
    buildId: getMostRecentBuildId(state, props),
    buildStatus: getProjectImageBuildStatus(state, props),
    buildsPath: `${paths.list}/${props.projectId}/${paths.builds}`
  })),
  withStyles(styles)
)
