import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { firebaseConnect } from 'react-redux-firebase'
import { withChildren } from 'enhancers'
import {
  LIST_PATH,
  RUNS_PATH,
  NEWRUN_PATH,
  TEST_RUNS_META_PATH
} from 'constants'
import styles from './RunsPage.styles'

export default compose(
  // create listener for runs, results go into redux
  firebaseConnect([{ path: TEST_RUNS_META_PATH }]),
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    runMetaData: data[TEST_RUNS_META_PATH]
  })),
  withChildren,
  withStyles(styles),
  withProps(({ params: { projectId } }) => ({
    projectId,
    newRunPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`
  })),
  withStyles(styles)
)
