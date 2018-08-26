import { ACCOUNT_PATH } from 'constants'

export function handleLogout(props) {
  return () => {
    props.firebase.logout()
    props.router.push('/')
    props.closeAccountMenu()
  }
}

export function goToAccount(props) {
  return () => {
    props.router.push(ACCOUNT_PATH)
    props.closeAccountMenu()
  }
}

export function googleLogin({ firebase, showError, router }) {
  return event =>
    firebase
      .login({ provider: 'google', type: 'redirect' })
      .catch(err => showError(err.message))
}
