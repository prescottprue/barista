import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { map } from 'lodash'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import RunMetaItem from './components/RunMetaItem'
import classnames from 'classnames'
import { COLUMN_HEADERS } from './RunsPage.constants'

export const RunsPage = ({
  runMetaData,
  classes,
  params,
  newRunPath,
  router
}) => (
  <Grid className={classes.root}>
    <Typography variant="headline" component="h3">
      Run History
    </Typography>
    <div className={classes.buttons}>
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
      map(runMetaData, (runData, runId) => (
        <RunMetaItem
          key={runId}
          runId={runId}
          params={params}
          router={router}
          {...runData}
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
  params: PropTypes.object, // from enhancer (firestoreConnect + connect)
  router: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default RunsPage
