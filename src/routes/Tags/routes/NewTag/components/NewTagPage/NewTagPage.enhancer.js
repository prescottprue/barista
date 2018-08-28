import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core'
import * as handlers from './NewTagPage.handlers'
import styles from './NewTagPage.styles'

export default compose(
  // add props.firebase
  withFirebase,
  // set proptypes used in enhancer
  setPropTypes({
    firebase: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
