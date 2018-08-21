import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classnames from 'classnames'
import { get } from 'lodash'
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
  runDetailPath,
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
      <Tooltip title="Build Number">
        <Typography align="center" variant="body1" className={classes.data}>
          {runId}
        </Typography>
      </Tooltip>
      <Tooltip title="Passing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {get(stats, 'passes', '-')}
        </Typography>
      </Tooltip>
      <Tooltip title="Failing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {get(stats, 'failures', '-')}
        </Typography>
      </Tooltip>
      <Tooltip title="Duration">
        <Typography align="center" variant="body1" className={classes.data}>
          {format(addMilliseconds(new Date(0), get(stats, 'duration')), 'mm:ss')}
        </Typography>
      </Tooltip>
      <Tooltip title="Ending Time">
        <Typography
          align="center"
          variant="body1"
          className={classnames(classes.data, classes.dateWords)}>
          {`${distanceInWordsToNow(get(stats, 'end'))} ago`}
        </Typography>
      </Tooltip>
      <Tooltip title="Environment">
        <Typography
          align="center"
          variant="body1"
          className={classnames(classes.data)}>
          {environment}
        </Typography>
      </Tooltip>
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
            component={Link}
            to={runDetailPath}
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
  runId: PropTypes.string.isRequired,
  pending: PropTypes.bool,
  stats: PropTypes.object,
  status: PropTypes.string,
  environment: PropTypes.string,
  runDetailPath: PropTypes.string.isRequired, // from enhancer (withProps)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  reRunJob: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default RunMetaItem
