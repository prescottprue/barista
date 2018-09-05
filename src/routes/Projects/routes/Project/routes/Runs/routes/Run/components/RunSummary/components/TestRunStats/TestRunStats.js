import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography } from '@material-ui/core'
import { HourglassEmpty } from '@material-ui/icons'

export const TestRunStats = ({ runMeta, durationInWords, classes }) => (
  <Paper className={classes.repo} elevation={0}>
    <Typography className={classes.label} component="p">
      StartedAt
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {runMeta.stats.startedAt}
    </Typography>
    <Typography className={classes.label} component="p">
      EndedAt
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {runMeta.stats.end}
    </Typography>
    <Typography className={classes.label} component="p">
      Duration
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      <HourglassEmpty />
      {durationInWords}
    </Typography>
  </Paper>
)

TestRunStats.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  testRunStats: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestRunStats
