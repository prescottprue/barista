import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  // create listener for newrun, results go into redux
  firebaseConnect([{ path: 'newrun' }]), 
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    newrun: data.newrun
  }))
)
