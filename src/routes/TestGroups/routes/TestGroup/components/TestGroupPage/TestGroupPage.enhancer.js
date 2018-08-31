import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { setPropTypes, mapProps, withHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { TEST_GROUPS_DATA_PATH, TEST_GROUP_FORM_NAME } from 'constants'
import { getTestGroup } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import styles from './TestGroupPage.styles'
import * as handlers from './TestGroupPage.handlers'

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      testGroupId: PropTypes.string.isRequired
    })
  }),
  mapProps(({ params: { testGroupId } }) => ({ testGroupId })),
  // create listener for testGroup, results go into redux
  firestoreConnect(({ testGroupId }) => [
    { collection: TEST_GROUPS_DATA_PATH, doc: testGroupId }
  ]),
  // map redux state to props
  connect((state, props) => ({
    testGroup: getTestGroup(state, props),
    initialValues: getTestGroup(state, props)
  })),
  // show spinner while test group loads
  spinnerWhileLoading(['testGroup']),
  // add handlers as props
  withHandlers(handlers),
  // add form capabilities and props
  reduxForm({
    form: TEST_GROUP_FORM_NAME
  }),
  withStyles(styles)
)
