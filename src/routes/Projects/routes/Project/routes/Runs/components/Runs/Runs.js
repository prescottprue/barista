import React from 'react'
import PropTypes from 'prop-types'
import classes from './Runs.scss'

export const Runs = ({ runs }) => (
  <div className={classes.container}>
    <span>Runs Component</span>
    <pre>{JSON.stringify(runs, null, 2)}</pre>
  </div>
)

Runs.propTypes = {
  runs: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default Runs
