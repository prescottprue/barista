import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'

export const RunsPage = ({ runsPage, classes, createNewRun }) => (
  <div className={classes.container}>
    <Button onClick={createNewRun}>Create New Job</Button>
    <span>Runs Component</span>
    <pre>{JSON.stringify(runsPage, null, 2)}</pre>
  </div>
)

RunsPage.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  runsPage: PropTypes.object, // from enhancer (firestoreConnect + connect)
  createNewRun: PropTypes.func // from enhancer (firestoreConnect + connect)
}

export default RunsPage
