import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, flattenProp, withProps, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { LIST_PATH, RUNS_PATH } from 'constants'
import { getProjectRunMeta } from 'selectors'
import { formatDateTime } from 'utils/formatters'
import * as handlers from './RunMetaItem.handlers'
import styles from './RunMetaItem.styles'

export default compose(
  // set proptypes used in enhancer
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    runId: PropTypes.string.isRequired
  }),
  // connect redux state to props
  connect((state, props) => ({
    runMeta: getProjectRunMeta(state, props)
  })),
  // flatten runMeta into pending, stats, status, environment,
  flattenProp('runMeta'),
  // flatten stats into duration, passes, failures, end
  flattenProp('stats'),
  // add custom props
  withProps(({ projectId, runId, duration, startedAt, completedAt }) => ({
    runDetailPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${runId}`,
    // Convert duration into minutes
    formattedDuration: duration ? (duration / 60000).toFixed(3) : '-',
    formattedStart: startedAt ? formatDateTime(startedAt) : '-'
  })),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)