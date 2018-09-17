import React from 'react'
import PropTypes from 'prop-types'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Tooltip,
  Avatar
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { formatTimeInterval } from 'utils/formatters'
import TestList from './components/TestList'
import { Timelapse } from '@material-ui/icons'

export const SuiteResult = ({
  suiteData,
  suiteDuration,
  suiteFailures,
  classes,
  name
}) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary
      expandIcon={<ExpandMoreIcon />}
      classes={{ content: classes.suiteSummary }}>
      <Typography variant="subheading" classes={{ root: classes.suiteTitle }}>
        {name}
      </Typography>
      {suiteFailures ? (
        <Tooltip
          title={`${suiteFailures} Suite Failure${
            suiteFailures > 1 ? 's' : ''
          }`}>
          <Avatar classes={{ root: classes.failCount }}>{suiteFailures}</Avatar>
        </Tooltip>
      ) : null}
      <Tooltip title={`Suite Duration`}>
        <Typography variant="body2" classes={{ root: classes.suiteDuration }}>
          <Timelapse classes={{ root: classes.baseIcon }} />
          {formatTimeInterval(suiteDuration, true)}
        </Typography>
      </Tooltip>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails classes={{ root: classes.details }}>
      <Typography variant="body1" component="h5" gutterBottom>
        Specs:
      </Typography>
      <TestList testList={suiteData} />
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

SuiteResult.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object, // from enhancer (withStyles)
  suiteData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]), // from enhancer (firestoreConnect + connect)
  suiteDuration: PropTypes.number,
  suiteFailures: PropTypes.number
}

export default SuiteResult
