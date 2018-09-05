import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './SourceCodeDetails.styles'

export default compose(
  withHandlers({
    // someHandler: props => value => {}
    openRepo: ({ projectId }) => () =>
      window.open(`https://github.com/reside-eng/${projectId}`)
  }),
  withStyles(styles)
)
