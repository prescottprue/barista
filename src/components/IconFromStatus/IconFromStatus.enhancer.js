import { compose } from 'redux'
import PropTypes from 'prop-types'
import { setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './IconFromStatus.styles'

export default compose(
  setPropTypes({
    status: PropTypes.string.isRequired,
    context: PropTypes.string
  }),
  withStyles(styles)
)
