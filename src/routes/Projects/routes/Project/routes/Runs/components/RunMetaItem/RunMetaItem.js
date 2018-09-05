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
import { ArrowForward as GoTo, Replay as Rerun } from '@material-ui/icons'
import IconFromStatus from 'components/IconFromStatus'

export const RunMetaItem = ({
  classes,
  runId,
  pending,
  testsPassed,
  testsFailed,
  formattedDuration,
  formattedStart,
  createdAtTooltip,
  status,
  runResult,
  environment,
  runDetailPath,
  reRunJob,
  totalTests,
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
        <IconFromStatus status={status} runResult={runResult} />
      </Typography>
      <Tooltip title="Run Id">
        <Typography align="center" variant="body1" className={classes.data}>
          {runId}
        </Typography>
      </Tooltip>
      <Tooltip title="Passing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {totalTests ? `${testsPassed}/${totalTests}` : '-'}
        </Typography>
      </Tooltip>
      <Tooltip title="Failing Tests">
        <Typography align="center" variant="body1" className={classes.data}>
          {totalTests ? `${testsFailed}/${totalTests}` : '-'}
        </Typography>
      </Tooltip>
      <Tooltip title="Duration">
        <Typography align="center" variant="body1" className={classes.data}>
          {formattedDuration}
        </Typography>
      </Tooltip>
      <Tooltip title={createdAtTooltip}>
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
          value={totalTests}
          valueBuffer={allTests}
        />
      ) : null}
    </ExpansionPanelSummary>
  </ExpansionPanel>
)

RunMetaItem.propTypes = {
  runId: PropTypes.string.isRequired,
  showProgress: PropTypes.bool.isRequired,
  pending: PropTypes.bool, // from enhancer (connect)
  status: PropTypes.string, // from enhancer (connect)
  environment: PropTypes.string, // from enhancer (connect)
  testsPassed: PropTypes.number, // from enhancer (mapProps)
  testsFailed: PropTypes.number, // from enhancer (mapProps)
  totalTests: PropTypes.number, // from enhancer (mapProps)
  formattedDuration: PropTypes.string, // from enhancer (withProps)
  formattedStart: PropTypes.string, // from enhancer (withProps)
  allTests: PropTypes.number, // from enhancer (flattenProp('runMeta'))
  runResult: PropTypes.string, // from enhancer (flattenProp('runMeta'))
  runDetailPath: PropTypes.string.isRequired, // from enhancer (withProps)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  reRunJob: PropTypes.func.isRequired, // from enhancer (withHandlers)
  startedAtToolTip: PropTypes.string.isRequired, // from enhancer (withProps)
  tests: PropTypes.number.isRequired, // from enhancer (flattenProp('stats'))
  createdAtTooltip: PropTypes.string.isRequired // from enhancer (withProps)
}

export default RunMetaItem
