import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTagGroups, getProjects, getTags } from 'selectors'
import { spinnerWhileLoading } from 'utils/components'
import styles from './TagGroupsTable.styles'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    tagGroups: getOrderedTagGroups(state, props),
    tags: getTags(state, props),
    projects: getProjects(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['tagGroups']),
  // add styles as classes prop
  withStyles(styles)
)