import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'utils/components'
import * as handlers from './NewRunPage.handlers'
import styles from './NewRunPage.styles'

export default compose(
  // add props.router
  withRouter,
  // add props.firebase
  withFirebase,
  // set proptypes used in handlers
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    }),
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  withHandlers(handlers),
  withStyles(styles)
)
