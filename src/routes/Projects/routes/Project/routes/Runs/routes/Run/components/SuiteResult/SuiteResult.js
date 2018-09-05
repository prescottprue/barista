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
import IconFromStatus from 'components/IconFromStatus'

export const SuiteResult = ({ suiteData, classes, name }) => (
  <ExpansionPanel defaultExpanded>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography variant="subheading">{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails className={classes.root}>
      <span>{get(first(suiteData), 'state')}</span>
      <div className={classes.root}>
        <Typography variant="body1">Specs:</Typography>
        {/* body, duration, err{message, name, stack}, pending, state, timings{'before all'[0].afterFnDuration, lifecycle, test.afterFnDuration, title, type, wallClockStartedAt */}
        {map(suiteData, (test, testId) => (
          <ExpansionPanel
            key={`Result-Spec-${testId}`}
            className={classes.root}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              classes={{
                root: classes.testSummaryPanel,
                content: classes.content
              }}>
              <IconFromStatus status={test.state} context={'test'} />
              <Typography className={classes.testTitle} variant="subheading">
                {test.title}
              </Typography>
              <Typography className={classes.testTitle} variant="subheading">
                {test.duration}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              <Highlight
                className="javascript atom-one-dark"
                style={{ display: 'block' }}>
                {test.body}
              </Highlight>
              <Highlight
                className="javascript atom-one-dark"
                style={{ display: 'block' }}>
                {`${get(test, 'err.name', '')}: ${get(
                  test,
                  'err.message',
                  ''
                )}`}
              </Highlight>
              <Highlight className="bash github" style={{ display: 'block' }}>
                {get(test, 'err.stack', '')}
              </Highlight>
            </ExpansionPanelDetails>

            <CardContent>
              {map(get(test, 'tests'), (test, testId) => (
                <Card key={`Result-Spec-${testId}`}>
                  <CardContent>
                    <div>State: {get(test, 'state')}</div>
                    <div>
                      Duration: {get(test, 'duration', 0) / 1000} seconds
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div>Duration: {get(test, 'duration', 0) / 1000} seconds</div>
            </CardContent>
          </ExpansionPanel>
        ))}
      </div>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

SuiteResult.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object, // from enhancer (withStyles)
  suiteData: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default SuiteResult
