import { compose } from 'redux'
import { withHandlers, branch, renderNothing, flattenProp } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './TestError.styles'

export default compose(
  withHandlers({
    // someHandler: props => value => {}
  }),
  branch(props => !props.error, renderNothing),
  flattenProp('error'),
  withStyles(styles)
)
