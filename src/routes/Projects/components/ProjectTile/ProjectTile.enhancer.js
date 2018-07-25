import { invoke } from 'lodash'
import { compose } from 'redux'
import { withStateHandlers, withProps } from 'recompose'
import { formatDate } from 'utils/formatters'

export default compose(
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
  withProps(({ project }) => ({
    formattedCreatedAt:
      project.createdAt && formatDate(invoke(project.createdAt, 'toDate'))
  }))
)
