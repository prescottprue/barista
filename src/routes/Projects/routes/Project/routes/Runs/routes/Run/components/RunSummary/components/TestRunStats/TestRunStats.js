import React from 'react'
import PropTypes from 'prop-types'
import { Paper, Typography, Tooltip } from '@material-ui/core'
import {
  HourglassFullTwoTone as Hourglass,
  Timelapse,
  AccessTime as Clock
} from '@material-ui/icons'
import classnames from 'classnames'

export const TestRunStats = ({
  requestedAt,
  completedDate,
  runDurationInWords,
  runDuration,
  requestDurationWords,
  classes,
  requestDuration
}) => (
  <Paper className={classes.container} elevation={0}>
    <Typography
      className={classnames(classes.label, classes.withIcon)}
      component="p">
      <Clock classes={{ root: classes.duration }} />
      Requested:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {requestedAt}
    </Typography>
    <Typography
      className={classnames(classes.label, classes.withIcon)}
      component="p">
      <Timelapse classes={{ root: classes.duration }} />
      Completed:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {completedDate}
    </Typography>
    <Typography
      className={classnames(classes.label, classes.withIcon)}
      component="p">
      <Hourglass classes={{ root: classes.duration }} />
      Request Duration:
    </Typography>
    <Tooltip title={`~${requestDurationWords}`} placement="bottom">
      <Typography className={classes.value} variant="body2" component="p">
        {requestDuration}
      </Typography>
    </Tooltip>
    <Typography
      className={classnames(classes.label, classes.withIcon)}
      component="p">
      <Timelapse classes={{ root: classes.duration }} />
      Test Duration:
    </Typography>
    <Tooltip title={`~${runDurationInWords}`} placement="bottom">
      <Typography
        className={classnames(classes.value, classes.withIcon)}
        variant="body2"
        component="p">
        {runDuration}
      </Typography>
    </Tooltip>
  </Paper>
)

TestRunStats.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  requestedAt: PropTypes.string,
  completedDate: PropTypes.string,
  runDurationInWords: PropTypes.string,
  runDuration: PropTypes.string,
  requestDurationWords: PropTypes.string,
  requestDuration: PropTypes.string
}

export default TestRunStats
