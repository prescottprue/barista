import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'utils/components'
import { TEST_RUNS_DATA_PATH, TEST_RUNS_META_PATH } from 'constants'
import { withHandlers, setPropTypes } from 'recompose'
import * as handlers from './RunPage.handlers'
import styles from './RunPage.styles'

export default compose(
  // create listener for runpage, results go into redux
  firebaseConnect(({ params }) => [
    { path: `${TEST_RUNS_DATA_PATH}/${params.runId}` },
    { path: `${TEST_RUNS_META_PATH}/${params.runId}` }
  ]),
  // map redux state to props
  connect(({ firebase: { data } }, { params }) => ({
    metaData: get(data, `${TEST_RUNS_META_PATH}/${params.runId}`),
    runData: get(data, `${TEST_RUNS_DATA_PATH}.${params.runId}`)
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
  withHandlers(handlers),
  withStyles(styles)
)
