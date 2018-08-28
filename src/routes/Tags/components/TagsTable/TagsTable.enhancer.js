import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { getOrderedTags } from 'selectors'
import styles from './TagsTable.styles'

export default compose(
  // map redux state to props
  connect((state, props) => ({
    tags: getOrderedTags(state, props)
  })),
  // add custom props
  withProps(() => ({
    // TODO: Remove this fake data
    tags: [
      {
        projects: { brawndo: true, barista: true },
        name: 'Docs',
        value: '@docs'
      }
    ]
  })),
  withHandlers({
    // someHandler: props => value => {}
  }),
  // add styles as classes prop
  withStyles(styles)
)
