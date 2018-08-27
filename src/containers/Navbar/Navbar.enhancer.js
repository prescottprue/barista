import { connect } from 'react-redux'
import {
  withHandlers,
  compose,
  withProps,
  flattenProp,
  withStateHandlers
} from 'recompose'
import { withFirebase, isEmpty, isLoaded } from 'react-redux-firebase'
import { withRouter, spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core'
import * as handlers from './Navbar.handlers'
import styles from './Navbar.styles'

export default compose(
  connect(({ firebase: { auth, profile } }) => ({
    auth,
    profile
  })),
  // Wait for auth to be loaded before going further
  spinnerWhileLoading(['profile']),
  withStateHandlers(
    ({ accountMenuOpenInitially = false }) => ({
      accountMenuOpen: accountMenuOpenInitially,
      anchorEl: null
    }),
    {
      closeAccountMenu: ({ accountMenuOpen }) => () => ({
        anchorEl: null
      }),
      handleMenu: () => event => ({
        anchorEl: event.target
      })
    }
  ),
  // Add props.router (used in handlers)
  withRouter,
  // Add props.firebase (used in handlers)
  withFirebase,
  // Add handlers as props
  withHandlers(handlers),
  withProps(({ auth, profile }) => ({
    authExists: isLoaded(auth) && !isEmpty(auth)
  })),
  // Flatten profile so that avatarUrl and displayName are available
  flattenProp('profile'),
  withStyles(styles)
)
