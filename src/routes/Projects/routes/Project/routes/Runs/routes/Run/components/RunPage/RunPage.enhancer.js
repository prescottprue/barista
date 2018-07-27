import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  // create listener for runpage, results go into redux
  firebaseConnect([{ path: 'runpage' }]), 
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    runpage: data.runpage
  }))
)
