import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import RunResultsList from '../RunResultsList'
import RunSummary from '../RunSummary'

export const RunPage = ({
  classes,
  runsPagePath,
  metaData,
  projectId,
  buildId,
  runId,
  ...other
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
    <RunSummary projectId={projectId} runId={runId} buildId={buildId} />
    <RunResultsList projectId={projectId} runId={runId} />
  </div>
)

RunPage.propTypes = {
  metaData: PropTypes.object,
  projectId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  runsPagePath: PropTypes.string.isRequired, // from enhancer (withProps)
  runId: PropTypes.string.isRequired, // from enhancer (withProps)
  buildId: PropTypes.string.isRequired // from enhancer (withProps)
}

export default RunPage
