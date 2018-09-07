import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { noop } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import styles from './RuntimeSummary.styles'
import { getGoogleComputInstanceId } from './RuntimeSummary.selectors'

export default compose(
  connect((state, props) => ({
    googleInstanceId: getGoogleComputInstanceId(state, props)
  })),
  withHandlers({
    // someHandler: props => value => {}
    viewLogs: ({ googleInstanceId, projectName }) => () => {
      if (!googleInstanceId) {
        return noop()
      }
      const filter = `(resource.type = "gce_instance" AND resource.labels.instance_id = "${googleInstanceId}") OR(resource.type = "global" AND jsonPayload.instance.id = "${googleInstanceId}")`
      const url = `https://console.cloud.google.com/logs/viewer?project=${projectName ||
        'barista-stage'}&advanceFilter=${encodeURIComponent(filter)}`
      window.open(url)
    }
  }),
  withStyles(styles)
)
