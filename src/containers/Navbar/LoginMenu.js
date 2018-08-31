import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

const buttonStyle = {
  color: 'white',
  textDecoration: 'none',
  alignSelf: 'center'
}

export const LoginMenu = ({ onSigninClick }) => (
  <div>
    <Button style={buttonStyle} onClick={onSigninClick}>
      Sign In
    </Button>
  </div>
)
LoginMenu.propTypes = {
  onSigninClick: PropTypes.func.isRequired
}

export default LoginMenu
