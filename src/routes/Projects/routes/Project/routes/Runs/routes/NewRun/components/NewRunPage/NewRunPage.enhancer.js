import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  // create listener for newrunpage, results go into redux
  firebaseConnect([{ path: 'newrunpage' }]),
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    newrunpage: data.newrunpage
  }))
)
