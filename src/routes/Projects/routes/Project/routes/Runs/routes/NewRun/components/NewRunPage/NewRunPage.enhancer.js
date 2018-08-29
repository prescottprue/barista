import PropTypes from 'prop-types'
import { compose } from 'redux'
import { firestoreConnect, withFirebase } from 'react-redux-firebase'
import { withHandlers, setPropTypes, withProps } from 'recompose'
import { withStyles } from '@material-ui/core'
import * as handlers from './NewRunPage.handlers'
import { paths, TAG_GROUPS_DATA_PATH } from 'constants'
import styles from './NewRunPage.styles'

export default compose(
  // add props.firebase
  withFirebase,
  // set proptypes used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  // add custom props
  withProps(({ params: { projectId } }) => ({
    projectId,
    runsPagePath: `${paths.list}/${projectId}/${paths.runs}`
  })),
  // listeners for data from Firestore
  firestoreConnect([{ collection: TAG_GROUPS_DATA_PATH }]),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
