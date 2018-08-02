import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { NEW_JOB_RUN_FORM_NAME } from 'constants'
import * as handlers from './NewRunForm.handlers'
import styles from './NewRunForm.styles'

export default compose(
  reduxForm({
    form: NEW_JOB_RUN_FORM_NAME,
    // Clear the form for future use (creating another project)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  withHandlers(handlers),
  withStyles(styles)
)
