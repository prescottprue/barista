import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTags } from 'selectors'
import styles from './TagsTable.styles'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoTagsFound from './NoTagsFound'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTags(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['tags']),
  // Show empty message if there are no props
  renderWhileEmpty(['tags'], NoTagsFound),
  // add styles as classes prop
  withStyles(styles)
)
