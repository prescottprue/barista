import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import TestResult from '../TestResult'
import Typography from '@material-ui/core/Typography'

export const TestResultsList = ({ testResults, metaData, classes }) => (
  <div className={classes.root}>
    <Typography className={classes.title} variant="title" component="h3">
      Test Results
    </Typography>
    {map(testResults, (testResult, name) => (
      <TestResult key={name} resultData={testResult} name={name} />
    ))}
  </div>
)

TestResultsList.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  metaData: PropTypes.object,
  testResults: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestResultsList
