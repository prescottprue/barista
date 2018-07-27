import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import classes from './Runs.scss'

export const Runs = ({ runs, createNewRun }) => (
  <div className={classes.container}>
    <Button onClick={createNewRun}>Create New Job</Button>
    <span>Runs Component</span>
    <pre>{JSON.stringify(runs, null, 2)}</pre>
  </div>
)

Runs.propTypes = {
  runs: PropTypes.object, // from enhancer (firestoreConnect + connect)
  createNewRun: PropTypes.func // from enhancer (firestoreConnect + connect)
}

export default Runs
