import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { TAG_GROUPS_DATA_PATH } from 'constants'
import styles from './TagGroupsPage.styles'

export default compose(
  // create listener for tagGroups, results go into redux
  firestoreConnect([{ collection: TAG_GROUPS_DATA_PATH }]),
  // add styles as classes prop
  withStyles(styles)
)
