import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './RuntimeSummary.styles'

export default compose(
  withHandlers({
    // someHandler: props => value => {}
    viewLogs: props => () => {
      const filter = `(resource.type = "gce_instance" AND resource.labels.instance_id = "${props.googleInstanaceId ||
        '9093009804445841080'}") OR(resource.type = "global" AND jsonPayload.instance.id = "${props.googleInstanaceId ||
        '9093009804445841080'}")`
      const url = `https://console.cloud.google.com/logs/viewer?project=${props.projectName ||
        'barista-stage'}&advanceFilter=${encodeURIComponent(filter)}`
      window.open(url)
    }
  }),
  withStyles(styles)
)
