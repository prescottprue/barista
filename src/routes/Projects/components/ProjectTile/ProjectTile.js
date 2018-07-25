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
import EditIcon from '@material-ui/icons/ModeEdit'
import classes from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  project,
  onSelect,
  onDelete,
  displayNames,
  menuClick,
  closeMenu,
  anchorEl,
  sharingDialogOpen,
  formattedCreatedAt,
  toggleSharingDialog
}) => (
  <Paper className={classes.container} open={open} data-test="project-tile">
    <div className={classes.top}>
      <span
        className={classes.name}
        onClick={() => onSelect(project)}
        data-test="project-tile-name">
        {project.name}
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
          <MenuItem
            onClick={() => onSelect(project)}
            data-test="project-tile-edit">
            <ListItemIcon className={classes.icon}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
          <MenuItem onClick={onDelete} data-test="project-tile-delete">
            <ListItemIcon className={classes.icon}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
    </div>
    {project.formattedCreatedAt ? (
      <span className={classes.createdAt}>{formattedCreatedAt}</span>
    ) : null}
    <div className="flex-column">
      <Tooltip title="Add Collaborators" placement="bottom">
        <IconButton onClick={toggleSharingDialog}>
          <PersonIcon />
        </IconButton>
      </Tooltip>
    </div>
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  displayNames: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  formattedCreatedAt: PropTypes.number,
  onDelete: PropTypes.func,
  anchorEl: PropTypes.object,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  open: PropTypes.bool
}

export default ProjectTile
