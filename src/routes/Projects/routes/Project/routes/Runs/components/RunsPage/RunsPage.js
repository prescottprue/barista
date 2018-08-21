import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import RunMetaItem from '../RunMetaItem'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import classnames from 'classnames'
import { LIST_PATH } from 'constants'
import { COLUMN_HEADERS } from './RunsPage.constants'

export const RunsPage = ({
  runMetaData,
  classes,
  params,
  newRunPath,
  projectId,
  router
}) => (
  <Grid className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Run History
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Projects">
        <IconButton component={Link} to={LIST_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="outlined"
        className={classes.reRunButton}
        component={Link}
        to={newRunPath}>
        Create New Job
      </Button>
    </div>
    <div className={classes.columnLabels}>
      {runMetaData &&
        COLUMN_HEADERS.map(({ label, align }, id) => (
          <Typography
            key={`${id}-${label}`}
            className={classnames(classes.columnLabel, classes[label])}
            variant="title"
            align={align}
            gutterBottom>
            {label}
          </Typography>
        ))}
    </div>
    {runMetaData ? (
      runMetaData.map((runData, runIndex) => (
        <RunMetaItem
          key={`${runData.key}-${runIndex}`}
          runId={runData.key}
          projectId={projectId}
        />
      ))
    ) : (
      <Paper className={classes.paper}>
        <div className="flex-row-center">No Runs Found In History</div>
      </Paper>
    )}
  </Grid>
)

RunsPage.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  runMetaData: PropTypes.object, // from enhancer (firestoreConnect + connect)
  newRunPath: PropTypes.string.isRequired, // from enhancer (withProps)
  projectId: PropTypes.string.isRequired, // from enhancer (withProps)
  params: PropTypes.object, // from enhancer (firestoreConnect + connect)
  router: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default RunsPage
