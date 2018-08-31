import PropTypes from 'prop-types'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { NEW_TEST_GROUP_FORM_NAME } from 'constants'
import { getOrderedProjects, getOrderedTags } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import styles from './NewTestGroupForm.styles'

const defaultTestFolderPath = 'test/e2e/integration'

const hardCodedFileOptions = [{ name: 'HomePage.spec.js' }].map(({ name }) => ({
  name: `${defaultTestFolderPath}/${name}`
}))

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    onSubmit: PropTypes.func.isRequired
  }),
  // add form capabilities and props
  reduxForm({
    form: NEW_TEST_GROUP_FORM_NAME,
    // Clear the form for future use (creating another tag)
    onSubmitSuccess: (result, dispatch, props) => props.reset()
  }),
  // map redux state to props
  connect((state, props) => ({
    projects: getOrderedProjects(state, props),
    testFiles: hardCodedFileOptions,
    tags: getOrderedTags(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['tags', 'projects']),
  // add classes prop with classes from NewRunForm.styles.js
  withStyles(styles)
)
