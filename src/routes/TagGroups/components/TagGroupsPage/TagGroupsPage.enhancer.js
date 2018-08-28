import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { TAG_GROUPS_DATA_PATH } from 'constants'
import styles from './TagGroupsPage.styles'
import { withChildren } from 'enhancers'

export default compose(
  // support child routes (i.e use children if present)
  withChildren,
  // create listener for tagGroups, results go into redux
  firestoreConnect([{ collection: TAG_GROUPS_DATA_PATH }]),
  // add styles as classes prop
  withStyles(styles)
)
