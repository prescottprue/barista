import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, setPropTypes, withProps } from 'recompose'
import { withFirebase, firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core'
import * as handlers from './NewRunPage.handlers'
import {
  CONTAINER_BUILDS_META_PATH,
  TEST_GROUPS_DATA_PATH,
  LIST_PATH,
  RUNS_PATH
} from 'constants'
import { getMostRecentBuildId, getTestGroups } from 'selectors'
import styles from './NewRunPage.styles'

export default compose(
  // add props.firebase
  withFirebase,
  // set proptypes used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  // add custom props
  withProps(({ params: { projectId } }) => ({
    projectId,
    runsPagePath: `${LIST_PATH}/${projectId}/${RUNS_PATH}`
  })),
  // ensure that we are getting the the build object of the last build image
  firestoreConnect(({ projectId }) => [
    // Listener for most recent container build for the current project
    // (used for current image info in NewRunForm)
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime', 'desc'],
      where: [['projectId', '==', projectId], ['status', '==', 'SUCCESS']],
      limit: 1,
      storeAs: `mostRecentBuild-${projectId}`
    },
    // Listener for all project container builds (used for branchNames in NewRunForm)
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime', 'desc'],
      where: ['projectId', '==', projectId],
      storeAs: `builds-${projectId}`
    },
    // Listener for test groups (used in NewRunForm)
    { collection: TEST_GROUPS_DATA_PATH }
  ]),
  // pass along the build id
  connect((state, props) => ({
    testGroups: getTestGroups(state, props),
    buildId: getMostRecentBuildId(state, props)
  })),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
