import React from 'react'
import PropTypes from 'prop-types'
import classes from './NewRun.scss'

export const NewRun = ({ newrun }) => (
  <div className={classes.container}>
    <span>NewRun Component</span>
    <pre>{JSON.stringify(newrun, null, 2)}</pre>
  </div>
)

NewRun.propTypes = {
  newrun: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default NewRun
