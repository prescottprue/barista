import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTags } from 'selectors'
import styles from './TagsTable.styles'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTags(state, props)
  })),
  spinnerWhileLoading(['tags']),
  withHandlers({
    // someHandler: props => value => {}
  }),
  // add styles as classes prop
  withStyles(styles)
)
