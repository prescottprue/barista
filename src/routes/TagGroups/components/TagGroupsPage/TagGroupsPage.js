import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import TagGroupsTable from '../TagGroupsTable'

export const TagGroupsPage = ({ tags, classes }) => (
  <div className={classes.container}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Tag Groups
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Home">
        <IconButton component={Link} to="/">
          <BackIcon />
        </IconButton>
      </Tooltip>
    </div>
    <div>
      <TagGroupsTable />
    </div>
  </div>
)

TagGroupsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tags: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default TagGroupsPage
