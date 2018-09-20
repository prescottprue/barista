import PropTypes from 'prop-types'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { setPropTypes } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { NEW_TEST_GROUP_FORM_NAME } from 'constants'
import {
  getOrderedProjects,
  getOrderedTags,
  getFilenamesGroupedByProjectId
} from 'selectors'
import { containerBuildsMetaQuery } from 'queryConfigs'
import { spinnerWhileLoading } from 'utils/components'
import styles from './NewTestGroupForm.styles'

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
  // Listeners for Firestore data, results go into redux
  firestoreConnect(() => [
    // create listener for builds
    containerBuildsMetaQuery()
  ]),
  // map redux state to props
  connect((state, props) => ({
    projects: getOrderedProjects(state, props),
    testFilesByProject: getFilenamesGroupedByProjectId(state, props),
    tags: getOrderedTags(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['tags', 'projects']),
  // add classes prop with classes from NewRunForm.styles.js
  withStyles(styles)
)
