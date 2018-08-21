import PropTypes from 'prop-types'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withProps, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { NEW_JOB_RUN_FORM_NAME, paths } from 'constants'
import styles from './NewRunForm.styles'

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
  }),
  // add form capabilities and props
  reduxForm({
    form: NEW_JOB_RUN_FORM_NAME,
    // Clear the form for future use (creating another project)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  // add custom props
  withProps(({ projectId }) => ({
    runsPath: `${paths.list}/${projectId}/${paths.runs}`,
    buildsPath: `${paths.list}/${projectId}/${paths.builds}`
  })),
  // add classes prop with classes from NewRunForm.styles.js
  withStyles(styles)
)
