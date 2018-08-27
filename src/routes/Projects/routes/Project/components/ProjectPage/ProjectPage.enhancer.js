import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withProps, setPropTypes } from 'recompose'
import { firestoreConnect, withFirebase } from 'react-redux-firebase'
import {
  spinnerWhileLoading,
  renderWhileEmpty,
  renderIfError
} from 'utils/components'
import { UserIsAuthenticated } from 'utils/router'
import { withChildren } from 'enhancers'
import { getProject } from 'selectors'
import ProjectNotFound from './ProjectNotFound'
import * as handlers from './ProjectPage.handlers'

export default compose(
  // redirect to /login if user is not logged in
  UserIsAuthenticated,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  // set proptypes used in handlers
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    uid: PropTypes.string.isRequired
  }),
  // Create listeners based on current users UID
  firestoreConnect(({ params, uid }) => [
    // Listener for projects the current user created
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  withProps(({ params }) => ({ projectId: params.projectId })),
  // Map projects from state to props
  connect((state, props) => ({
    project: getProject(state, props)
  })),
  renderWhileEmpty(['project'], ProjectNotFound),
  renderIfError(
    [(state, { params }) => `projects.${params.projectId}`],
    ProjectNotFound
  ),
  withChildren,
  withFirebase,
  // Show loading spinner while project is loading
  spinnerWhileLoading(['project']),
  withHandlers(handlers)
)
