import { compose } from 'redux'
import PropTypes from 'prop-types'
import { setPropTypes, branch, renderNothing } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './TestCode.styles'

export default compose(
  setPropTypes({
    testCode: PropTypes.string
  }),
  branch(props => !props.testCode, renderNothing),
  withStyles(styles)
)
