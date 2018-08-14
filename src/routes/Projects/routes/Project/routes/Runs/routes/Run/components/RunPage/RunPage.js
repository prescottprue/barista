import React from 'react'
import PropTypes from 'prop-types'
import { uppercase, get } from 'lodash'
import Typography from '@material-ui/core/Typography'

export const RunPage = ({ runMeta, classes, runData, params: { runId } }) => (
  <div className={classes.container}>
    <Typography className={classes.title} variant="display1">
      {`${uppercase(get(runMeta, 'environment', 'unkown'))} - Job ${runId}`}
    </Typography>
    <Typography className={classes.title} variant="headline" align="left">
      Summary
    </Typography>
    <pre>{JSON.stringify({ runMeta }, null, 2)}</pre>
    <Typography className={classes.title} variant="headline" align="left">
      Specs
    </Typography>
    {runData && <pre>{JSON.stringify(runData, null, 2)}</pre>}
  </div>
)

RunPage.propTypes = {
  runMeta: PropTypes.object, // from enhancer (firestoreConnect + connect)
  runData: PropTypes.object, // from enhancer (firestoreConnect + connect)
  classes: PropTypes.object, // from enhancer (firestoreConnect + connect)
  params: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default RunPage
