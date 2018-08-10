import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import {
  CONTAINER_BUILDS_META_PATH,
  CONTAINER_BUILDS_STATUS_PATH
} from 'constants'
import styles from './Builds.styles'

export default compose(
  // create listener for builds, results go into redux
  firestoreConnect([
    { collection: CONTAINER_BUILDS_META_PATH, orderBy: ['createdAt'] }
  ]),
  firebaseConnect([
    {
      path: CONTAINER_BUILDS_STATUS_PATH
    }
  ]),
  // map redux state to props
  connect(state => ({
    buildStatuses: state.firebase.data[CONTAINER_BUILDS_STATUS_PATH],
    builds: state.firestore.ordered[CONTAINER_BUILDS_META_PATH]
  })),
  withStyles(styles)
)
