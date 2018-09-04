import React from 'react'
import PropTypes from 'prop-types'
import { first, get, map } from 'lodash'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Highlight from 'react-highlight'

import {
  Error as ErrorIcon,
  CheckCircle,
  Warning,
  ArrowForward as GoTo,
  RemoveCircleOutline as Rerun
} from '@material-ui/icons'

function iconFromStatus(status, classes) {
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

export const TestResult = ({ resultData, classes, name }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className={classes.heading}>{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails className={classes.root}>
      <span>{get(first(resultData), 'state')}</span>
      <div className={classes.root}>
        Specs:
        {/* body, duration, err{message, name, stack}, pending, state, timings{'before all'[0].afterFnDuration, lifecycle, test.afterFnDuration, title, type, wallClockStartedAt */}
        {map(resultData, (suite, suiteId) => (
          <ExpansionPanel
            key={`Result-Spec-${suiteId}`}
            className={classes.root}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              {iconFromStatus(suite.state, classes)}
              <Typography className={classes.heading}>{suite.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              <Highlight
                className="javascript atom-one-dark"
                style={{ display: 'block' }}>
                {suite.body}
              </Highlight>
              <Highlight
                className="javascript atom-one-dark"
                style={{ display: 'block' }}>
                {`${get(suite, 'err.name', '')}: ${get(
                  suite,
                  'err.message',
                  ''
                )}`}
              </Highlight>
              <Highlight className="bash github" style={{ display: 'block' }}>
                {get(suite, 'err.stack', '')}
              </Highlight>
            </ExpansionPanelDetails>

            <CardContent>
              {map(get(suite, 'tests'), (test, testId) => (
                <Card key={`Result-Spec-${testId}`}>
                  <CardContent>
                    <div>State: {get(test, 'state')}</div>
                    <div>
                      Duration: {get(test, 'duration', 0) / 1000} seconds
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div>Duration: {get(suite, 'duration', 0) / 1000} seconds</div>
            </CardContent>
          </ExpansionPanel>
        ))}
      </div>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

TestResult.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object, // from enhancer (withStyles)
  resultData: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestResult
