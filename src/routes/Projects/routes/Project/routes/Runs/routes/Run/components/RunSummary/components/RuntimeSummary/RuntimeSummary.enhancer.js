import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './RuntimeSummary.styles'

export default compose(
  withHandlers({
    // someHandler: props => value => {}
    viewLogs: props => () => {
      const filter = `(resource.type = "gce_instance" AND resource.labels.instance_id = "${'instanceId'}") OR(resource.type = "global" AND jsonPayload.instance.id = "${'instanceId'}")`
      const baseUrl = `https://console.cloud.google.com/logs/viewer?project`
    }
  }),
  withStyles(styles)
)
