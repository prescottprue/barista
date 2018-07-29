import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

export const RunsPage = ({ runsPage, classes, createNewRun }) => (
  <div className={classes.root}>
    <div className={classes.buttons}>
      <Button variant="raised" color="primary" onClick={createNewRun}>
        Create New Job
      </Button>
    </div>
    <Paper className={classes.paper}>
      <span>Runs Component</span>
    </Paper>
    <pre>{JSON.stringify(runsPage, null, 2)}</pre>
  </div>
)

RunsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  runsPage: PropTypes.object, // from enhancer (firestoreConnect + connect)
  createNewRun: PropTypes.func // from enhancer (firestoreConnect + connect)
}

export default RunsPage
