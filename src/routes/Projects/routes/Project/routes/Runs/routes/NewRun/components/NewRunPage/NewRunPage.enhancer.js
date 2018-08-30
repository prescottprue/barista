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
  paths
} from 'constants'
import { getMostRecentBuildId } from 'selectors'
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
    runsPagePath: `${paths.list}/${projectId}/${paths.runs}`
  })),
  // ensure that we are getting the the build object of the last build image
  firestoreConnect(({ projectId }) => [
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime', 'desc'],
      where: ['projectId', '==', projectId],
      limit: 1,
      storeAs: `mostRecentBuild-${projectId}`
    },
    { collection: TEST_GROUPS_DATA_PATH }
  ]),
  // pass along the build id
  connect((state, props) => ({
    buildId: getMostRecentBuildId(state, props)
  })),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
