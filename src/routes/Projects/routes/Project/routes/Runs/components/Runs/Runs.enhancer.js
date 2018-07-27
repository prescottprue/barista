import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  // create listener for runs, results go into redux
  firebaseConnect([{ path: 'runs' }]), 
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    runs: data.runs
  }))
)
