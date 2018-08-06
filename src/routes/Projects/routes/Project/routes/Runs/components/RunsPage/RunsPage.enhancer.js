import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { firebaseConnect } from 'react-redux-firebase'
import { withChildren } from 'enhancers'
import { LIST_PATH, RUNS_PATH, NEWRUN_PATH } from 'constants'
import styles from './RunsPage.styles'

export default compose(
  // create listener for runs, results go into redux
  firebaseConnect([{ path: 'test_results_meta' }]),
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    testMetaData: data['test_results_meta']
  })),
  withChildren,
  withStyles(styles),
  withHandlers({
    createNewRun: ({ router, params: { projectId } }) => () => {
      router.push(`${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`)
    }
  })
)
