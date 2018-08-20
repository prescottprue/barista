import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { CONTAINER_BUILDS_STATUS_PATH } from 'constants'
import { setPropTypes } from 'recompose'
import { firebaseConnect } from 'react-redux-firebase'
import styles from './ImageBuildStatus.styles'
import { getProjectImageBuildStatus } from 'selectors'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired
  }),
  firebaseConnect([
    {
      path: CONTAINER_BUILDS_STATUS_PATH
    }
  ]),
  // map redux state to props
  connect((state, props) => ({
    buildStatus: getProjectImageBuildStatus(state, props)
  })),
  withStyles(styles)
)
