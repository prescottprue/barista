import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import classnames from 'classnames'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import LinearProgress from '@material-ui/core/LinearProgress'
import {
  Error as ErrorIcon,
  CheckCircle,
  Warning,
  ArrowForward as GoTo,
  Replay as Rerun
} from '@material-ui/icons'

function iconFromStatus({ status, runResult, classes }) {
  if (runResult === 'failed') {
    return <ErrorIcon color="error" />
  }
  switch (status) {
    case 'failed':
      return <ErrorIcon color="error" />
    case 'passed':
      return <CheckCircle className={classes.pass} />
    case 'pending':
      return <Rerun color="disabled" className={classes.pending} />
    default:
      return <Warning />
  }
}

export const RunMetaItem = ({
  classes,
  runId,
  pending,
  passes,
  failures,
  formattedDuration,
  formattedStart,
  startedAtToolTip,
  status,
  runResult,
  environment,
  runDetailPath,
  reRunJob,
  tests,
  showProgress,
  allTests
}) => (
  <ExpansionPanel className={classes.root}>
    <ExpansionPanelSummary
      classes={{
        content: showProgress ? classes.progressMargin : classes.summary,
        root: classes.summaryRoot
      }}>
      <Typography align="center" variant="body1" className={classes.data}>
        {iconFromStatus({ status, classes, runResult })}
      </Typography>
      <Tooltip title="Run Id">
        <Typography align="center" variant="body1" className={classes.data}>
          {runId}
        </Typography>
      </Tooltip>
      <Tooltip title="Passing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {passes || '-'}
        </Typography>
      </Tooltip>
      <Tooltip title="Failing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {failures || '-'}
        </Typography>
      </Tooltip>
      <Tooltip title="Duration">
        <Typography align="center" variant="body1" className={classes.data}>
          {formattedDuration}
        </Typography>
      </Tooltip>
      <Tooltip title={startedAtToolTip}>
        <Typography
          align="center"
          variant="body1"
          className={classnames(classes.data, classes.dateWords)}>
          {formattedStart}
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
      {showProgress ? (
        <LinearProgress
          className={classnames(classes.progressBar)}
          variant="determinate"
          value={tests}
          valueBuffer={allTests}
        />
      ) : null}
    </ExpansionPanelSummary>
  </ExpansionPanel>
)

RunMetaItem.propTypes = {
  runId: PropTypes.string.isRequired,
  pending: PropTypes.number,
  passes: PropTypes.number,
  failures: PropTypes.number,
  formattedDuration: PropTypes.string, // from enhancer (withProps)
  formattedStart: PropTypes.string, // from enhancer (withProps)
  status: PropTypes.string,
  allTests: PropTypes.number, // from enhancer (flattenProp('runMeta'))
  tests: PropTypes.number, // from enhancer (flattenProp('stats'))
  runResult: PropTypes.string, // from enhancer (flattenProp('runMeta'))
  showProgress: PropTypes.bool.isRequired,
  environment: PropTypes.string,
  runDetailPath: PropTypes.string.isRequired, // from enhancer (withProps)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  reRunJob: PropTypes.func.isRequired, // from enhancer (withHandlers)
  startedAtToolTip: PropTypes.string.isRequired // from enhancer (withProps)
}

export default RunMetaItem
