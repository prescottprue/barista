import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteIcon from '@material-ui/icons/Delete'
import PersonIcon from '@material-ui/icons/Person'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import classes from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  name,
  projectId,
  menuClick,
  closeMenu,
  anchorEl,
  sharingDialogOpen,
  formattedCreatedAt,
  toggleSharingDialog,
  clickProjectDelete,
  clickSelectProject
}) => (
  <Paper className={classes.container} open={open} data-test="project-tile">
    <div className={classes.top}>
      <span
        className={classes.name}
        onClick={clickSelectProject}
        data-test="project-tile-name">
        {name}
      </span>
      <div>
        <IconButton onClick={menuClick} data-test="project-tile-more">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}>
          <MenuItem onClick={clickSelectProject} data-test="project-tile-edit">
            <ListItemIcon className={classes.icon}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
          <MenuItem
            onClick={clickProjectDelete}
            data-test="project-tile-delete">
            <ListItemIcon className={classes.icon}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
    </div>
    {formattedCreatedAt ? (
      <span className={classes.createdAt}>{formattedCreatedAt}</span>
    ) : null}
    <div className="flex-column">
      <Tooltip title="Sharing - Coming Soon" placement="bottom">
        <div>
          <IconButton onClick={toggleSharingDialog} disabled>
            <PersonIcon />
          </IconButton>
        </div>
      </Tooltip>
    </div>
  </Paper>
)

ProjectTile.propTypes = {
  name: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  formattedCreatedAt: PropTypes.string, // from enhancer (withProps)
  anchorEl: PropTypes.object, // from enhancer (withStateHandlers)
  menuClick: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeMenu: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleSharingDialog: PropTypes.func, // from enhancer (withStateHandlers)
  clickProjectDelete: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clickSelectProject: PropTypes.func.isRequired, // from enhancer (withHandlers)
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
