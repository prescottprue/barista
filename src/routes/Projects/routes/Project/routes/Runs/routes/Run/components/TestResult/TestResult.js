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

export const TestResult = ({ resultData, classes, name }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className={classes.heading}>{name}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <div>
        <span>{get(first(resultData), 'state')}</span>
        <div>
          Specs:
          {map(resultData, (suite, suiteId) => (
            <Card key={`Result-Spec-${suiteId}`}>
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
            </Card>
          ))}
        </div>
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
