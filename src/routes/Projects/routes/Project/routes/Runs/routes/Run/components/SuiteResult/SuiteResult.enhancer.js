import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import styles from './SuiteResult.styles'
import {
  getSuiteDurationInWords,
  getSuiteFailures
} from './SuiteResult.selectors'

export default compose(
  connect((state, props) => ({
    suiteDuration: getSuiteDurationInWords(state, props),
    suiteFailures: getSuiteFailures(state, props)
  })),
  withStyles(styles)
)
