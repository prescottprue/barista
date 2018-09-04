import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { TEST_GROUPS_DATA_PATH, TAGS_DATA_PATH } from 'constants'
import styles from './TestGroupsPage.styles'
import { withChildren } from 'enhancers'

export default compose(
  // support child routes (i.e use children if present)
  withChildren,
  // create listener for testGroups, results go into redux
  firestoreConnect([
    { collection: TEST_GROUPS_DATA_PATH },
    { collection: TAGS_DATA_PATH }
  ]),
  // add styles as classes prop
  withStyles(styles)
)
