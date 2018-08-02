import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import { withHandlers, setPropTypes } from 'recompose'
import { withStyles } from '@material-ui/core'
import { withRouter } from 'utils/components'
import * as handlers from './NewRunPage.handlers'
import styles from './NewRunPage.styles'

export default compose(
  // create listener for newrunpage, results go into redux
  firebaseConnect([{ path: 'newrunpage' }]),
  // map redux state to props
  connect(({ firebase: { data } }) => ({
    newrunpage: data.newrunpage
  })),
  withRouter,
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  withHandlers(handlers),
  withStyles(styles)
)
