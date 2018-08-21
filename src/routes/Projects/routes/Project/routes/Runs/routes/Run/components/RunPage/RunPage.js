import React from 'react'
import PropTypes from 'prop-types'
import TestResultsList from '../TestResultsList'
import Typography from '@material-ui/core/Typography'

export const RunPage = ({ classes, runData, metaData, params }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography className={classes.title} variant="title" component="h3">
        Run {params.runId}
      </Typography>
    </div>
    <TestResultsList testResults={runData} metaData={metaData} />
  </div>
)

RunPage.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  runData: PropTypes.object,
  metaData: PropTypes.object,
  params: PropTypes.shape({
    runId: PropTypes.string.isRequired
  })
}

export default RunPage
