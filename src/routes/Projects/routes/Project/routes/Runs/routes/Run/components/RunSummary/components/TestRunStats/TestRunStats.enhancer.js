import { compose } from 'redux'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { withHandlers, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './TestRunStats.styles'
import {
  getProjectRunMeta,
  getRunDurationWords,
  getRunDuration
} from 'selectors'
import {
  getRequestCreated,
  getTestEnd,
  getRunRequestDuration,
  getRunRequestDurationInWords
} from './TestRunStats.selectors'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    runId: PropTypes.string.isRequired
  }),
  connect((state, props) => ({
    runMeta: getProjectRunMeta(state, props),
    requestedAt: getRequestCreated(state, props),
    completedDate: getTestEnd(state, props),
    requestDurationWords: getRunRequestDurationInWords(state, props),
    requestDuration: getRunRequestDuration(state, props),
    runDurationInWords: getRunDurationWords(state, props),
    runDuration: getRunDuration(state, props)
  })),
  withHandlers({
    // someHandler: props => value => {}
  }),
  withStyles(styles)
)
