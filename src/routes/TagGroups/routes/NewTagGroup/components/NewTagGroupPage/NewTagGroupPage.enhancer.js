import { compose } from 'redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { TAGS_DATA_PATH, PROJECTS_DATA_PATH } from 'constants'
import styles from './NewTagGroupPage.styles'
import { getAuthUid } from 'selectors'
import * as handlers from './NewTagGroupPage.handlers'

export default compose(
  // create listener for tags, results go into redux
  firestoreConnect([
    { collection: PROJECTS_DATA_PATH, where: ['public', '==', true] },
    { collection: TAGS_DATA_PATH }
  ]),
  // map redux state to props
  connect((state, props) => ({
    uid: getAuthUid(state, props)
  })),
  // add handlers as props
  withHandlers(handlers),
  // add styles as classes prop
  withStyles(styles)
)
