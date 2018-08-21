import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import TestResult from '../TestResult'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import CircularProgress from '@material-ui/core/CircularProgress'

export const TestResultsList = ({ testResults, metaData, classes }) => (
  <div className={classes.root}>
    <Typography className={classes.title} variant="title" component="h3">
      Test Results
    </Typography>
    {testResults ? (
      map(testResults, (testResult, name) => (
        <TestResult key={name} resultData={testResult} name={name} />
      ))
    ) : !metaData ? (
      <Paper className={classes.notFound}>
        <div>Meta Data Not Found</div>
      </Paper>
    ) : (
      <CircularProgress />
    )}
  </div>
)

TestResultsList.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  metaData: PropTypes.object,
  testResults: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestResultsList
