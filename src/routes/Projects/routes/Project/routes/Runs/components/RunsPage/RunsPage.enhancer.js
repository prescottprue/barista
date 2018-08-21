import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { firebaseConnect } from 'react-redux-firebase'
import { withChildren } from 'enhancers'
import {
  LIST_PATH,
  RUNS_PATH,
  NEWRUN_PATH,
  TEST_RUNS_META_PATH
} from 'constants'
import { getProjectOrderedProjectRunsMeta } from 'selectors'
import styles from './RunsPage.styles'

export default compose(
  withProps(({ params: { projectId } }) => ({
    projectId,
    newRunPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`
  })),
  setPropTypes({
    projectId: PropTypes.string.isRequired, // used in multiple HOCs
    newRunPath: PropTypes.string.isRequired // used in handlers
  }),
  // create listener for runs, results go into redux
  firebaseConnect(({ projectId }) => [
    {
      path: `${TEST_RUNS_META_PATH}/${projectId}`,
      queryParams: ['orderByChild=createdAt'],
      storeAs: `${projectId}-testRunsMeta`
    }
  ]),
  // map redux state to props
  connect((state, props) => ({
    runMetaData: getProjectOrderedProjectRunsMeta(state, props)
  })),
  withChildren,
  withStyles(styles)
)
