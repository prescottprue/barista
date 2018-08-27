import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'

export const TagsPage = ({ tags, classes }) => (
  <div className={classes.container}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Tags
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton component={Link} to="/">
          <BackIcon />
        </IconButton>
      </Tooltip>
    </div>
  </div>
)

TagsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tags: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TagsPage
