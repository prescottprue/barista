import { compose } from 'redux'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { withHandlers, setPropTypes, flattenProp, withProps } from 'recompose'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { CONTAINER_BUILDS_META_PATH } from 'constants'
import {
  getProjectRunMeta,
  getRunBuildData,
  getRunDurationWords
} from 'selectors'
import { withStyles } from '@material-ui/core/styles'
import { renderWhile } from 'utils/components'
import styles from './RunSummary.styles'
import { NoRunSummary } from './NoRunSummary'

export default compose(
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    buildId: PropTypes.string.isRequired,
    runId: PropTypes.string.isRequired
  }),
  firestoreConnect(({ projectId, runId, buildId }) => [
    {
      collection: CONTAINER_BUILDS_META_PATH,
      orderBy: ['finishTime', 'desc'],
      where: ['buildId', '==', buildId],
      limit: 1,
      storeAs: `buildId${runId}`
    }
  ]),
  connect((state, props) => ({
    buildData: getRunBuildData(state, props),
    runMeta: getProjectRunMeta(state, props),
    durationInWords: getRunDurationWords(state, props)
  })),
  renderWhile(
    ({ runMeta, buildData }) => !runMeta || !buildData,
    withStyles(styles)(NoRunSummary)
  ),
  withHandlers({
    // someHandler: props => value => {}
  }),
  withStyles(styles)
)
