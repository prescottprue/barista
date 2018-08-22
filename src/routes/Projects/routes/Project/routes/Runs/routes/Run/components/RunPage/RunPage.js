import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import BackIcon from '@material-ui/icons/ArrowBack'
import TestResultsList from '../TestResultsList'

export const RunPage = ({
  classes,
  runData,
  runsPagePath,
  metaData,
  runId
}) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Run {runId}
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton component={Link} to={runsPagePath}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </div>
    {runData ? (
      <TestResultsList testResults={runData} metaData={metaData} />
    ) : (
      <Paper>Pulling Container...</Paper>
    )}
    <TestResultsList testResults={runData} metaData={metaData} />
  </div>
)

RunPage.propTypes = {
  runData: PropTypes.object,
  metaData: PropTypes.object,
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  runsPagePath: PropTypes.string.isRequired, // from enhancer (withProps)
  runId: PropTypes.string.isRequired // from enhancer (withProps)
}

export default RunPage
