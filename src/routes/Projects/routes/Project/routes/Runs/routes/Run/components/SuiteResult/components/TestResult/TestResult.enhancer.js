import { compose } from 'redux'
import PropTypes from 'prop-types'
import {
  setPropTypes,
  defaultProps,
  flattenProp,
  branch,
  renderNothing
} from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './TestResult.styles'

export default compose(
  setPropTypes({
    test: PropTypes.object.isRequired
  }),
  branch(props => !props.test, renderNothing),
  flattenProp('test'),
  defaultProps({
    title:
      '**There was an error that occured before the test name could be captured**',
    duration: 0
  }),
  withStyles(styles)
)
