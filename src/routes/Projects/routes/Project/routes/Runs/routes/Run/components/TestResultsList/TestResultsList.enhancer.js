import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { getSuitesWithTests } from 'selectors'
import { renderWhile } from 'utils/components'
import TestResultsNotFound from './TestResultsNotFound'
import styles from './TestResultsList.styles'

export default compose(
  // set prop-types used in enhancer
  setPropTypes({
    projectId: PropTypes.string.isRequired
  }),
  // map redux state to props
  connect((state, props) => ({
    runData: getSuitesWithTests(state, props)
  })),
  renderWhile(
    ({ runData }) => !runData,
    withStyles(styles)(TestResultsNotFound)
  ),
  // add props.clases from RunPage.styles
  withStyles(styles)
)
