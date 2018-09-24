import React from 'react'
import PropTypes from 'prop-types'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Tooltip,
  Paper
} from '@material-ui/core'
import {
  formatTimeInterval,
  strictDistanceInWords,
  addDurationToNow
} from 'utils/formatters'
import classnames from 'classnames'
import IconFromStatus from 'components/IconFromStatus'
import TestError from '../TestError'
import TestCode from '../TestCode'

export const TestResult = ({
  title,
  state,
  testId,
  duration,
  err,
  body,
  classes
}) => (
  <div className={classes.container}>
    <Paper className={classnames(classes.spacer, classes[state])} />
    <ExpansionPanel
      key={`Result-Spec-${testId}`}
      classes={{ root: classes.root, expanded: classes.expanded }}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: classes.testSummaryPanel,
          content: classes.content
        }}>
        <IconFromStatus status={state} context={'test'} />
        <Typography className={classes.testTitle} variant="subheading">
          {title}
        </Typography>
        <Tooltip
          title={`~${strictDistanceInWords(addDurationToNow(duration))}`}>
          <Typography className={classes.testTitle} variant="subheading">
            {formatTimeInterval(duration, true)}
          </Typography>
        </Tooltip>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
        <TestCode testCode={body} />
        <TestError error={err} />
        <Typography variant="subheading" component="p">
          {`Duration: ${duration / 1000} seconds`}
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
)

TestResult.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  title: PropTypes.string, // from enhancer flattenProp('test')
  state: PropTypes.string, // from enhancer flattenProp('test')
  testId: PropTypes.number, // from enhancer flattenProp('test')
  duration: PropTypes.number, // from enhancer flattenProp('test')
  err: PropTypes.object, // from enhancer flattenProp('test')
  body: PropTypes.string // from enhancer flattenProp('test')
}

export default TestResult
