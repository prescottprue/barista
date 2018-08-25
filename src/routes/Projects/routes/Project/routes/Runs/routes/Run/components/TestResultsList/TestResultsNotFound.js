import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

export const TestResultsNotFound = ({ classes }) => (
  <Paper className={classes.empty}>
    <CircularProgress />
    <Typography className={classes.progressMsg}>Running...</Typography>
  </Paper>
)

TestResultsNotFound.propTypes = {
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TestResultsNotFound
