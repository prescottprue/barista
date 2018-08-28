import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { TAGS_DATA_PATH } from 'constants'
import { getOrderedTags } from 'selectors'
import styles from './NewTagGroupPage.styles'
import * as handlers from './NewTagGroupPage.handlers'

export default compose(
  // create listener for tags, results go into redux
  firestoreConnect([{ collection: TAGS_DATA_PATH }]),
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTags(state, props)
  })),
  // add handlers as props
  withHandlers(handlers),
  // add styles as classes prop
  withStyles(styles)
)
