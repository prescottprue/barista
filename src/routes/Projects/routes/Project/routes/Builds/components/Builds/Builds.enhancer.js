import PropTypes from 'prop-types'
import { compose } from 'redux'
import { setPropTypes, mapProps } from 'recompose'
import { connect } from 'react-redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import styles from './Builds.styles'
import { getBuildStatuses, getOrderedBuilds } from 'selectors'
import { containerBuildsMetaQuery } from 'queryConfigs'

export default compose(
  // set proptypes used in handlers
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    })
  }),
  mapProps(({ params: { projectId } }) => ({ projectId })),
  // Listeners for Firestore data, results go into redux
  firestoreConnect(({ projectId }) => [
    // create listener for builds
    containerBuildsMetaQuery({ projectId })
  ]),
  // Listeners for RTDB data, results go into redux
  firebaseConnect([
    {
      path: CONTAINER_BUILDS_STATUS_PATH
    }
  ]),
  // map redux state to props
  connect((state, props) => ({
    buildStatuses: getBuildStatuses(state, props),
    builds: getOrderedBuilds(state, props)
  })),
  withStyles(styles)
)
