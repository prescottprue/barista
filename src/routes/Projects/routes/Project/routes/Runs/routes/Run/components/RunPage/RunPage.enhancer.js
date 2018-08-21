import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers, withProps, setPropTypes } from 'recompose'
import { paths, TEST_RUNS_DATA_PATH, TEST_RUNS_META_PATH } from 'constants'
import { withRouter } from 'utils/components'
import * as handlers from './RunPage.handlers'
import styles from './RunPage.styles'

export default compose(
  // create listener for runpage, results go into redux
  firebaseConnect(({ params: { projectId, runId } }) => [
    { path: `${TEST_RUNS_DATA_PATH}/${projectId}/${runId}` },
    { path: `${TEST_RUNS_META_PATH}/${projectId}/${runId}` }
  ]),
  // map redux state to props
  connect(({ firebase: { data } }, { params: { projectId, runId } }) => ({
    metaData: get(data, `${TEST_RUNS_META_PATH}.${projectId}.${runId}`),
    runData: get(data, `${TEST_RUNS_DATA_PATH}.${projectId}.${runId}`)
  })),
  // add props.router
  withRouter,
  // set prop-types used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  withProps(({ params: { projectId, runId } }) => ({
    projectId,
    runId,
    runsPagePath: `${paths.list}/${projectId}/${paths.runs}`
  })),
  withHandlers(handlers),
  withStyles(styles)
)
