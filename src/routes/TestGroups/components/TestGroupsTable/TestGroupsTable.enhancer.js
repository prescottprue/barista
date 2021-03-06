import { compose } from 'redux'
import { connect } from 'react-redux'
import { size } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTestGroups, getProjects, getTags } from 'selectors'
import { spinnerWhileLoading, renderWhile } from 'utils/components'
import TestGroupsNotFound from './TestGroupsNotFound'
import styles from './TestGroupsTable.styles'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    testGroups: getOrderedTestGroups(state, props),
    tags: getTags(state, props),
    projects: getProjects(state, props)
  })),
  // show spinner while tags data is loading
  spinnerWhileLoading(['testGroups']),
  // Show loading spinner while tests are running
  renderWhile(
    ({ testGroups }) => !size(testGroups),
    withStyles(styles)(TestGroupsNotFound)
  ),
  // add styles as classes prop
  withStyles(styles)
)
