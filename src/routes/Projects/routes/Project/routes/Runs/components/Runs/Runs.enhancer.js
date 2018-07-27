import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { firebaseConnect } from 'react-redux-firebase'
import { withChildren } from 'enhancers'
import { LIST_PATH, RUNS_PATH, NEWRUN_PATH } from 'constants'

export default compose(
  // create listener for runs, results go into redux
  firebaseConnect([{ path: 'runs' }]),
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    runs: data.runs
  })),
  withChildren,
  withHandlers({
    createNewRun: ({ router, params: { projectId } }) => () => {
      router.push(`${LIST_PATH}/${projectId}/${RUNS_PATH}/${NEWRUN_PATH}`)
    }
  })
)
