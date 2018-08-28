import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTagGroups } from 'selectors'
import styles from './TagGroupsTable.styles'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTagGroups(state, props)
  })),
  // add custom props
  withProps(() => ({
    // TODO: Remove this fake data
    tagGroups: [
      {
        projects: { brawndo: true, barista: true },
        name: 'Add Docs',
        tags: [{ value: '@docs' }]
      }
    ]
  })),
  withHandlers({
    // someHandler: props => value => {}
  }),
  // add styles as classes prop
  withStyles(styles)
)
