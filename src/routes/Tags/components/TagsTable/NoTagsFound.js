import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

export const NoTagsFound = ({ tags, classes }) => (
  <Paper className={classes.root}>
    <Typography>No Tags Found</Typography>
  </Paper>
)

NoTagsFound.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tags: PropTypes.array // from enhancer (firestoreConnect + connect)
}

export default NoTagsFound
