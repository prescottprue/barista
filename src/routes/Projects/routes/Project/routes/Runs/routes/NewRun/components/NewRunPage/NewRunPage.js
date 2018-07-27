import React from 'react'
import PropTypes from 'prop-types'
import classes from './NewRunPage.scss'

export const NewRunPage = ({ newrunpage }) => (
  <div className={classes.container}>
    <span>NewRunPage Component</span>
    <pre>{JSON.stringify(newrunpage, null, 2)}</pre>
  </div>
)

NewRunPage.propTypes = {
  newrunpage: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default NewRunPage
