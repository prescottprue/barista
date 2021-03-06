import PropTypes from 'prop-types'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { NEW_TAG_FORM_NAME } from 'constants'
import styles from './NewTagForm.styles'

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    onSubmit: PropTypes.func.isRequired
  }),
  // add form capabilities and props
  reduxForm({
    form: NEW_TAG_FORM_NAME,
    // Clear the form for future use (creating another tag)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  // add classes prop with classes from NewRunForm.styles.js
  withStyles(styles)
)
