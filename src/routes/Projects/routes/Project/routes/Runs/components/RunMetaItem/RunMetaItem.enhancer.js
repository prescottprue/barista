import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withFirebase } from 'react-redux-firebase'
import {
  withHandlers,
  flattenProp,
  withProps,
  setPropTypes,
  defaultProps
} from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { LIST_PATH, RUNS_PATH } from 'constants'
import { getProjectRunMeta } from 'selectors'
import { formatDateTime, strictDistanceInWords } from 'utils/formatters'
import * as handlers from './RunMetaItem.handlers'
import styles from './RunMetaItem.styles'

export default compose(
  withFirebase,
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    runId: PropTypes.string.isRequired,
    firebase: PropTypes.object,
    router: PropTypes.object
  }),
  defaultProps({
    totalTestCount: 0
  }),
  // connect redux state to props
  connect((state, props) => ({
    runMeta: getProjectRunMeta(state, props)
  })),
  // flatten runMeta into pending, stats, status, environment,
  flattenProp('runMeta'),
  // add custom props
  withProps(
    ({
      projectId,
      runId,
      createdAt,
      totalTestCount,
      tests: testsRun,
      stats,
      runMeta
    }) => ({
      testsPassed: get(stats, 'passes'),
      testsFailed: get(stats, 'failures'),
      totalTests: get(stats, 'failures', 0) + get(stats, 'passes', 0),
      runDetailPath: `${LIST_PATH}/${projectId}/${RUNS_PATH}/${runId}`,
      // Convert duration into seconds
      formattedDuration: get(stats, 'duration')
        ? (get(stats, 'duration') / 1000).toFixed(3)
        : '-',
      formattedStart: createdAt ? formatDateTime(createdAt) : '-',
      createdAtTooltip: createdAt
        ? `${strictDistanceInWords(createdAt)} ago`
        : '-',
      showProgress:
        runMeta.status === 'pending' && totalTestCount > 0 && testsRun
    })
  ),
  // add handlers as props
  withHandlers(handlers),
  // add classes prop with classes from RunMetaItem.styles.js
  withStyles(styles)
)
