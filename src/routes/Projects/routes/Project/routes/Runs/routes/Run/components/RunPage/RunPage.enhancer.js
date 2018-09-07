import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { firebaseConnect } from 'react-redux-firebase'
import { withHandlers, withProps, setPropTypes } from 'recompose'
import {
  LIST_PATH,
  RUNS_PATH,
  TEST_RUNS_META_PATH,
  TEST_RUNS_DATA_PATH
} from 'constants'
import { getProjectRunMeta, getRunBuildId } from 'selectors'
import * as handlers from './RunPage.handlers'
import styles from './RunPage.styles'

export default compose(
  // set prop-types used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired,
      runId: PropTypes.string.isRequired
    })
  }),
  // create listener for runpage, results go into redux
  firebaseConnect(({ params: { projectId, runId } }) => [
    { path: `${TEST_RUNS_META_PATH}/${projectId}/${runId}` },
    { path: `${TEST_RUNS_DATA_PATH}/${projectId}/${runId}` }
  ]),
  withProps(({ params: { projectId, runId } }) => ({
    projectId,
    runId,
    runsPagePath: `${LIST_PATH}/${projectId}/${RUNS_PATH}`
  })),
  // map redux state to props
  connect((state, props) => ({
    metaData: getProjectRunMeta(state, props),
    buildId: getRunBuildId(state, props)
  })),
  // add custom props
  // add handlers as props
  withHandlers(handlers),
  // add props.clases from RunPage.styles
  withStyles(styles)
)
