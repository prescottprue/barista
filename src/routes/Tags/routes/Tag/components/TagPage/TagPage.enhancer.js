import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { setPropTypes, mapProps, withHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import { TAGS_DATA_PATH, TAG_FORM_NAME } from 'constants'
import { getTag } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import styles from './TagPage.styles'
import * as handlers from './TagPage.handlers'

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      tagId: PropTypes.string.isRequired
    })
  }),
  mapProps(({ params: { tagId } }) => ({ tagId })),
  // create listener for tag, results go into redux
  firestoreConnect(({ tagId }) => [{ collection: TAGS_DATA_PATH, doc: tagId }]),
  // map redux state to props
  connect((state, props) => ({
    tag: getTag(state, props),
    initialValues: getTag(state, props)
  })),
  // show spinner while test group loads
  spinnerWhileLoading(['tag']),
  // add handlers as props
  withHandlers(handlers),
  // add form capabilities and props
  reduxForm({
    form: TAG_FORM_NAME
  }),
  withStyles(styles)
)
