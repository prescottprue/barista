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
  TEST_RUNS_META_PATH,
  TEST_RUNS_DATA_PATH
} from 'constants'
import { getProjectOrderedProjectRunsMeta } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import styles from './RunsPage.styles'

export default compose(
  // add custom props
  withProps(({ params: { projectId } }) => ({
    projectId,
    newRunPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`
  })),
  // set proptypes used in enhancer
  setPropTypes({
    projectId: PropTypes.string.isRequired, // used in enhancer
    newRunPath: PropTypes.string.isRequired // used in enhancer (handlers)
  }),
  // create listener for runs, results go into redux
  firebaseConnect(({ projectId }) => [
    {
      path: `${TEST_RUNS_META_PATH}/${projectId}`,
      queryParams: ['orderByChild=createdAt'],
      storeAs: `${projectId}-testRunsMeta` // storeAs is used for ordered list data
    },
    {
      path: `${TEST_RUNS_DATA_PATH}/${projectId}`,
      queryParams: ['orderByChild=createdAt'],
      storeAs: `${projectId}-testRunsData` // storeAs is used for ordered list data
    }
  ]),
  // map redux state to props
  connect((state, props) => ({
    runMetaData: getProjectOrderedProjectRunsMeta(state, props)
  })),
  spinnerWhileLoading(['runMetaData']),
  withChildren,
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
