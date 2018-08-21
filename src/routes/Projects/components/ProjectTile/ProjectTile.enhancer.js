import PropTypes from 'prop-types'
import { compose } from 'redux'
import {
  withStateHandlers,
  setPropTypes,
  withProps,
  withHandlers
} from 'recompose'
import { formatDate } from 'utils/formatters'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    onSelectClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
  }),
  withStateHandlers(
    ({ initialDialogOpen = false, initialAnchorEl = null }) => ({
      sharingDialogOpen: initialDialogOpen,
      anchorEl: initialAnchorEl
    }),
    {
      toggleSharingDialog: ({ sharingDialogOpen }) => action => ({
        sharingDialogOpen: !sharingDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ sharingDialogOpen }) => () => ({
        sharingDialogOpen: !sharingDialogOpen
      }),
      closeMenu: () => () => ({
        anchorEl: null
      }),
      menuClick: () => e => ({
        anchorEl: e.target
      })
    }
  ),
  withHandlers({
    clickSelectProject: props => () => props.onSelectClick(props.projectId),
    clickProjectDelete: props => () => props.onDeleteClick(props.projectId)
  }),
  withProps(({ createdAt }) => ({
    formattedCreatedAt: formatDate(createdAt)
  }))
)
