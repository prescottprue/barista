import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from '@material-ui/core'
import TestRunStats from './components/TestRunStats'
import SourceCodeDetails from './components/SourceCodeDetails'
import RuntimeSummary from './components/RuntimeSummary'
import IconFromStatus from 'components/IconFromStatus'
import {
  Clear as FailedIcon,
  Check as PassedIcon,
  NotInterested as SkipIcon
} from '@material-ui/icons'

export const RunSummary = ({
  projectId,
  buildId,
  classes,
  buildData,
  runMeta,
  startedAt,
  durationInWords
}) => (
  <div className={classes.root}>
    <Typography className={classes.title} variant="headline" component="h1">
      Summary
    </Typography>
    <ExpansionPanel className={classes.root} defaultExpanded>
      <ExpansionPanelSummary classes={{ content: classes.content }}>
        <IconFromStatus
          status={runMeta.status}
          classes={{ root: classes.titleIcon }}
        />
        <Typography
          className={classes.cardTitle}
          variant="title"
          component="h2">
          {runMeta.status}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          classes={{ root: classes.iconData }}>
          <SkipIcon classes={{ root: classes.skipIcon }} />
          {runMeta.stats.pending}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          classes={{ root: classes.iconData }}>
          <PassedIcon classes={{ root: classes.passedIcon }} />
          {runMeta.stats.passes}
        </Typography>
        <Typography
          variant="body1"
          component="span"
          classes={{ root: classes.iconData }}>
          <FailedIcon classes={{ root: classes.failedIcon }} />
          {runMeta.stats.failures}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails classes={{ root: classes.detailsRoot }}>
        <SourceCodeDetails
          projectId={projectId}
          buildId={buildId}
          buildData={buildData}
          runMeta={runMeta}
        />
        <TestRunStats
          projectId={projectId}
          buildId={buildId}
          runMeta={runMeta}
          durationInWords={durationInWords}
        />
        <RuntimeSummary />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
)

RunSummary.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildId: PropTypes.string, // from enhancer (firestoreConnect + connect)
  projectId: PropTypes.string,
  buildData: PropTypes.string,
  runMeta: PropTypes.object,
  startedAt: PropTypes.string,
  durationInWords: PropTypes.string
}

export default RunSummary
