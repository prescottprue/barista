import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import { TAG_GROUPS_PATH } from 'constants'
import BackIcon from '@material-ui/icons/ArrowBack'
import TagGroupsTable from '../TagGroupsTable'

export const TagGroupsPage = ({ classes }) => (
  <div className={classes.root}>
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
      <Button
        variant="outlined"
        className={classes.createButton}
        component={Link}
        to={`${TAG_GROUPS_PATH}/new`}>
        Create Tag Group
      </Button>
    </div>
    <TagGroupsTable />
  </div>
)

TagGroupsPage.propTypes = {
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TagGroupsPage
