import PropTypes from 'prop-types'
import { compose } from 'redux'
import { setPropTypes, mapProps } from 'recompose'
import { connect } from 'react-redux'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import {
  CONTAINER_BUILDS_META_PATH,
  CONTAINER_BUILDS_STATUS_PATH
} from 'constants'
import styles from './Builds.styles'
import { getBuildStatuses, getOrderedBuilds } from 'selectors'

export default compose(
  // set proptypes used in handlers
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    })
  }),
  mapProps(({ params: { projectId } }) => ({ projectId })),
  // create listener for builds, results go into redux
  firestoreConnect(({ projectId }) => [
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime', 'desc'],
      where: ['projectId', '==', projectId]
    }
  ]),
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
