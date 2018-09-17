import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Tooltip,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from '@material-ui/core'
import IconFromStatus from 'components/IconFromStatus'
import {
  Clear as FailedIcon,
  Check as PassedIcon,
  NotInterested as SkipIcon
} from '@material-ui/icons'
import { get } from 'lodash'
import TestRunStats from './components/TestRunStats'
import RuntimeSummary from './components/RuntimeSummary'
import SourceCodeDetails from './components/SourceCodeDetails'

export const RunSummary = ({
  projectId,
  runId,
  buildId,
  classes,
  buildData,
  runMeta,
  status,
  startedAt,
  durationInWords
}) => (
  <div className={classes.root}>
    <ExpansionPanel className={classes.root} defaultExpanded>
      <ExpansionPanelSummary classes={{ content: classes.content }}>
        <IconFromStatus status={status} classes={{ root: classes.titleIcon }} />
        <Typography
          className={classes.cardTitle}
          variant="title"
          component="h2">
          {status}
        </Typography>
        <Tooltip title="pending">
          <Typography
            variant="body1"
            component="span"
            classes={{ root: classes.iconData }}>
            <SkipIcon classes={{ root: classes.skipIcon }} />
            {get(runMeta, 'stats.pending', '-')}
          </Typography>
        </Tooltip>
        <Tooltip title="passes">
          <Typography
            variant="body1"
            component="span"
            classes={{ root: classes.iconData }}>
            <PassedIcon classes={{ root: classes.passedIcon }} />
            {get(runMeta, 'stats.passes', '-')}
          </Typography>
        </Tooltip>
        <Tooltip title="failures">
          <Typography
            variant="body1"
            component="span"
            classes={{ root: classes.iconData }}>
            <FailedIcon classes={{ root: classes.failedIcon }} />
            {get(runMeta, 'stats.failures', '-')}
          </Typography>
        </Tooltip>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
        <SourceCodeDetails
          projectId={projectId}
          buildId={buildId}
          buildData={buildData}
          runMeta={runMeta}
        />
        <TestRunStats projectId={projectId} runId={runId} />
        <RuntimeSummary projectId={projectId} runId={runId} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
)

RunSummary.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildId: PropTypes.string, // from enhancer (firestoreConnect + connect)
  projectId: PropTypes.string,
  status: PropTypes.string,
  runId: PropTypes.string,
  buildData: PropTypes.object,
  runMeta: PropTypes.object,
  startedAt: PropTypes.string,
  durationInWords: PropTypes.string
}

export default RunSummary
