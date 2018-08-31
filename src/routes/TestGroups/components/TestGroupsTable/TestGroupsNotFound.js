import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

export const TestGroupsNotFound = ({ classes }) => (
  <Paper className={classes.empty}>
    <Typography className={classes.progressMsg}>
      No Test Groups Found. Create one above!
    </Typography>
  </Paper>
)

TestGroupsNotFound.propTypes = {
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TestGroupsNotFound
