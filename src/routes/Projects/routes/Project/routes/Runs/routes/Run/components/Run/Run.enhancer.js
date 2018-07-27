import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  // create listener for run, results go into redux
  firebaseConnect([{ path: 'run' }]), 
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    run: data.run
  }))
)
