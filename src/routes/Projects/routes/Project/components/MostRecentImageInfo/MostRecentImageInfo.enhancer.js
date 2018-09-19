import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import { setPropTypes } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import {
  getMostRecentCommitSha,
  getMostRecentBranchName,
  getMostRecentBuildId,
  getMostRecentBuild
} from 'selectors'
import { mostRecentContainerBuildMetaQuery } from 'queryConfigs'
import styles from './MostRecentImageInfo.styles'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired
  }),
  // Listeners for Firestore data, results go into redux
  firestoreConnect(({ projectId }) => [
    mostRecentContainerBuildMetaQuery({ projectId })
  ]),
  // map redux state to props
  connect((state, props) => ({
    branchName: getMostRecentBranchName(state, props),
    commitSha: getMostRecentCommitSha(state, props),
    buildId: getMostRecentBuildId(state, props),
    updatedAt: get(getMostRecentBuild(state, props), 'updatedAt')
  })),
  withStyles(styles)
)
