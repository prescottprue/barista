import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withHandlers,
  flattenProp,
  defaultProps,
  setPropTypes
} from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './SourceCodeDetails.styles'
import { githubOrgBaseUrl } from './SourceCodeDetails.constants'
import { getShortCommitSha } from './SourceCodeDetails.selectors'

export default compose(
  setPropTypes({
    commitSha: PropTypes.string,
    shortenedSha: PropTypes.string
  }),
  defaultProps({
    commitSha: '',
    shortenedSha: ''
  }),
  withHandlers({
    // someHandler: props => value => {}
    openRepo: ({ projectId }) => () =>
      window.open(`${githubOrgBaseUrl}${projectId}`),
    goToCommit: ({ projectId, buildData }) => () =>
      window.open(
        `${githubOrgBaseUrl}${projectId}/commit/${buildData.commitSha}`
      ),
    copyCommit: ({ buildData }) => e => {
      e.preventDefault()
      e.stopPropagation()
      return navigator.clipboard.writeText(buildData.commitSha)
    },
    copyBuildId: ({ buildId }) => e => {
      e.preventDefault()
      e.stopPropagation()
      return navigator.clipboard.writeText(buildId)
    },
    goToBranch: ({ projectId, buildData }) => () =>
      window.open(
        `${githubOrgBaseUrl}${projectId}/tree/${buildData.branchName}`
      )
  }),
  connect((state, props) => ({
    shortenedSha: getShortCommitSha(state, props)
  })),
  flattenProp('buildData'),
  withStyles(styles)
)
