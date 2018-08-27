import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import styles from './TagsPage.styles'

export default compose(
  // create listener for tags, results go into redux
  firestoreConnect([{ collection: 'tags' }]),
  // map redux state to props
  connect(({ firestore: { data } }) => ({
    tags: data.tags
  })),
  withStyles(styles)
)
