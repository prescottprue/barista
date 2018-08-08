import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import {
  Error as ErrorIcon,
  CheckCircle,
  Warning,
  ArrowForward as GoTo,
  Replay as Rerun
} from '@material-ui/icons'
import { format, addMilliseconds, distanceInWordsToNow } from 'date-fns'

export const RunMetaItem = ({
  classes,
  runId,
  pending,
  stats,
  status,
  environment,
  goToDetails,
  reRunJob
}) => (
  <ExpansionPanel className={classes.root}>
    <ExpansionPanelSummary
      classes={{
        content: classes.summary,
        root: classes.summaryRoot
      }}>
      <Typography align="center" variant="body1" className={classes.data}>
        {/* eslint-disable prettier/prettier */}
        {status === 'failed' ? <ErrorIcon color="error" />
          : status === 'passed' ? <CheckCircle className={classes.pass}/>
          : status === 'pending' ? <Rerun color="disabled" className={classes.pending}/>
          : <Warning />
        }
        {/* eslint-disable-end prettier/prettier spaced-comment */}
      </Typography>
      <Typography align="center" variant="body1" className={classes.data}>
        {runId}
      </Typography>
      <Typography align="center" variant="body1" className={classes.data}>
        {stats.passes}
      </Typography>
      <Typography align="center" variant="body1" className={classes.data}>
        {stats.failures}
      </Typography>
      <Typography align="center" variant="body1" className={classes.data}>
        {format(addMilliseconds(new Date(0), stats.duration), 'mm:ss')}
      </Typography>
      <Typography
        align="center"
        variant="body1"
        className={classnames(classes.data, classes.dateWords)}>
        {distanceInWordsToNow(stats.end)}
      </Typography>
      <Typography
        align="center"
        variant="body1"
        className={classnames(classes.data)}>
        {environment}
      </Typography>
      <div className={classes.buttonContainer}>
        {status === 'failed' ? (
          <Tooltip title="Re-run">
            <Button
              variant="fab"
              aria-label="re-run-job"
              onClick={reRunJob}
              mini
              className={classnames(classes.button, classes.reRun)}>
              <Rerun />
            </Button>
          </Tooltip>
        ) : null}
        <Tooltip title="View Details">
          <Button
            variant="fab"
            color="primary"
            aria-label="go-to-details"
            onClick={goToDetails}
            mini
            className={classnames(classes.button, classes.detailsButton)}>
            <GoTo />
          </Button>
        </Tooltip>
      </div>
    </ExpansionPanelSummary>
  </ExpansionPanel>
)

RunMetaItem.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  runId: PropTypes.string,
  pending: PropTypes.bool,
  stats: PropTypes.object,
  status: PropTypes.string,
  environment: PropTypes.string,
  goToDetails: PropTypes.func,
  reRunJob: PropTypes.func
}

export default RunMetaItem
