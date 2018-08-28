import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { TAGS_DATA_PATH } from 'constants'
import { withStyles } from '@material-ui/core/styles'
import styles from './TagsPage.styles'
import { getOrderedTags } from 'selectors'
import { withChildren } from 'enhancers'

export default compose(
  withChildren,
  // create listener for tags, results go into redux
  firestoreConnect([{ collection: TAGS_DATA_PATH }]),
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTags(state, props)
  })),
  // add styles as classes prop
  withStyles(styles)
)
