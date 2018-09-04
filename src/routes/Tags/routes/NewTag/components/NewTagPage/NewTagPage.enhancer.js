import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, setPropTypes } from 'recompose'
import { withFirestore } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core'
import * as handlers from './NewTagPage.handlers'
import { getAuthUid } from 'selectors'
import styles from './NewTagPage.styles'

export default compose(
  // add props.firebase
  withFirestore,
  // set proptypes used in enhancer
  setPropTypes({
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  // map redux state to props
  connect((state, props) => ({
    uid: getAuthUid(state, props)
  })),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
