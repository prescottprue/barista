import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { get } from 'lodash'
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
  firebaseConnect(({ params }) => [
    { path: `${TEST_RUNS_META_PATH}/${params.projectId}` }
  ]),
  // map redux state to props
  connect(({ firebase: { data } }, { params }) => ({
    runMetaData: get(data, `${TEST_RUNS_META_PATH}.${params.projectId}`)
  })),
  withChildren,
  withStyles(styles),
  withProps(({ params: { projectId } }) => ({
    projectId,
    newRunPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`
  })),
  withStyles(styles)
)
