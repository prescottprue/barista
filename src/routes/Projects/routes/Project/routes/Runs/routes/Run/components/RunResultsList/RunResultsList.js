import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import SuiteResult from '../SuiteResult'
import Typography from '@material-ui/core/Typography'

export const RunResultsList = ({ runData, metaData, classes }) => (
  <div className={classes.root}>
    <Typography className={classes.title} variant="title" component="h3">
      Test Results
    </Typography>
    {map(runData, (testResult, name) => (
      <SuiteResult
        key={testResult.title || name}
        suiteData={testResult.tests}
        name={testResult.title || name}
      />
    ))}
  </div>
)

RunResultsList.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  metaData: PropTypes.object,
  runData: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default RunResultsList
