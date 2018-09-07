import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Paper } from '@material-ui/core'
import TestResult from '../TestResult'

export const TestList = ({ testList, classes }) => (
  <Paper classes={{ root: classes.root }} elevation={0}>
    {map(testList, (test, testId) => (
      <TestResult test={test} testId={testId} key={testId} />
    ))}
  </Paper>
)

TestList.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  testList: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TestList
