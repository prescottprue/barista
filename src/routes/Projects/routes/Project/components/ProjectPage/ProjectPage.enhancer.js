import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { firestoreConnect, withFirebase, getVal } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import * as handlers from './ProjectPage.handlers'

export default compose(
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  // Create listeners based on current users UID
  firestoreConnect(({ params, uid }) => [
    // Listener for projects the current user created
    {
      collection: 'projects',
      where: ['createdBy', '==', uid]
    }
  ]),
  // Map projects from state to props
  connect(({ firestore: { data } }, { params }) => ({
    project: getVal(data, `projects/${params.projectname}`)
  })),
  withFirebase,
  // Show loading spinner while project is loading
  spinnerWhileLoading(['project']),
  withStateHandlers({}, {}),
  withHandlers(handlers)
)
