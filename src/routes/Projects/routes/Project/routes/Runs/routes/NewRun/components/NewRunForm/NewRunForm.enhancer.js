import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTestGroups, getProjectBranchNames } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import { NEW_JOB_RUN_FORM_NAME } from 'constants'
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
  // map redux state to props
  connect((state, props) => ({
    orderedTestGroups: getOrderedTestGroups(state, props),
    branchNames: getProjectBranchNames(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['orderedTestGroups']),
  // add classes prop with classes from NewRunForm.styles.js
  withStyles(styles)
)
