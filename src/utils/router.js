import { UserAuthWrapper } from 'redux-auth-wrapper'
import { browserHistory } from 'react-router'
import { LIST_PATH } from 'constants'
import LoadingSpinner from 'components/LoadingSpinner'
import { showSuccess, showError } from 'modules/notification/actions'
const AUTHED_REDIRECT = 'AUTHED_REDIRECT'
const UNAUTHED_REDIRECT = 'UNAUTHED_REDIRECT'

/**
 * @description Higher Order Component that redirects to `/login` instead
 * rendering if user is not authenticated (default of redux-auth-wrapper).
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsAuthenticated = UserAuthWrapper({
  wrapperDisplayName: 'UserIsAuthenticated',
  LoadingComponent: LoadingSpinner,
  authSelector: ({ firebase: { auth } }) => auth,
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) =>
    !auth.isLoaded || isInitializing,
  predicate: auth => !auth.isEmpty && auth.uid,
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc)
    dispatch({
      type: UNAUTHED_REDIRECT,
      payload: { message: 'User is not authenticated.' }
    })
  }
})

/**
 * @description Higher Order Component that redirects to listings page or most
 * recent route instead rendering if user is not authenticated. This is useful
 * routes that should not be displayed if a user is logged in, such as the
 * login route.
 * @param {Component} componentToWrap - Component to wrap
 * @return {Component} wrappedComponent
 */
export const UserIsNotAuthenticated = UserAuthWrapper({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  allowRedirectBack: false,
  LoadingComponent: LoadingSpinner,
  failureRedirectPath: (state, props) =>
    // redirect to page user was on or to list path
    props.location.query.redirect || LIST_PATH,
  authSelector: ({ firebase: { auth } }) => auth,
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) =>
    !auth.isLoaded || isInitializing,
  predicate: auth => auth.isEmpty,
  redirectAction: newLoc => dispatch => {
    browserHistory.replace(newLoc)
    dispatch({ type: AUTHED_REDIRECT })
  }
})

/**
 * @description Fired when route is updated. Route updates are tracked if
 environment is production
 */
export const createOnEnter = store => (
  { location: { query, pathname }, auth },
  replace
) => {
  const currentItem = sessionStorage.getItem('fbToken')
  function loginWithToken(token) {
    return store.firebase
      .login({ token: currentItem })
      .then(() => {
        /* eslint-disable no-console */
        console.debug('Auth through fbToken successful!')
        showSuccess('Login through token successful')(store.dispatch)
      })
      .catch(err => {
        console.debug(
          `Error logging in through auth token: ${err.message || ''}`,
          err
        )
        showError((err && err.message) || 'Error logging in through token')(
          store.dispatch
        )
        Raven.captureException('Error authenticating with Auth token', err)
        return Promise.reject(err)
      })
  }
  if (currentItem) {
    const reduxState = store.getState()
    // Logout if already logged in
    if (reduxState.firebase.auth && reduxState.firebase.auth.uid) {
      return store.firebase.logout().then(loginWithToken())
    }
    // Otherwise login
    console.debug('fbToken found in session storage, logging in...')
    /* eslint-enable no-console */
    return loginWithToken()
  }

  return null
}

export default {
  UserIsAuthenticated,
  UserIsNotAuthenticated
}
