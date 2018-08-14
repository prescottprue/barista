import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { invoke } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import { LIST_PATH, RUNS_PATH } from 'constants'
import styles from './RunMetaItem.styles'

export default compose(
  withHandlers({
    goToDetails: ({ router, params: { projectId }, runId }) => e => {
      invoke(e, 'preventDefault')
      invoke(e, 'stopPropagation')
      router.push(`${LIST_PATH}/${projectId}/${RUNS_PATH}/${runId}`)
    },
    reRunJob: ({ router, params: { projectId }, runId }) => e => {
      invoke(e, 'preventDefault')
      invoke(e, 'stopPropagation')
      console.log('placeholder - rerun job', runId) // eslint-disable-line
    }
  }),
  withStyles(styles)
)
