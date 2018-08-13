import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { firebaseConnect } from 'react-redux-firebase'
import styles from './RunPage.styles'

export default compose(
  // create listener for runpage, results go into redux
  withStyles(styles),
  firebaseConnect(({ params: { runId } }) => [
    { path: `test_results_meta/${runId}`, storeAs: 'runMeta' },
    { path: `test_results_data/${runId}`, storeAs: 'runData' }
  ]),
  // map redux state to props
  connect(({ firebase: { data } }, { params: { runId } }) => ({
    runMeta: data['runMeta'],
    runData: data['runData']
  }))
)
