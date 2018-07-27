import React from 'react'
import PropTypes from 'prop-types'
import classes from './Run.scss'

export const Run = ({ run }) => (
  <div className={classes.container}>
    <span>Run Component</span>
    <pre>{JSON.stringify(run, null, 2)}</pre>
  </div>
)

Run.propTypes = {
  run: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default Run
