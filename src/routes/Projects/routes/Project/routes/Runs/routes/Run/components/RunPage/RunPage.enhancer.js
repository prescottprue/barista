import PropTypes from 'prop-types'
import { compose } from 'redux'
// import { connect } from 'react-redux'
// import { firebaseConnect } from 'react-redux-firebase'
import { withRouter } from 'utils/components'
import { withHandlers, setPropTypes } from 'recompose'
import * as handlers from './RunPage.handlers'

export default compose(
  // create listener for runpage, results go into redux
  // firebaseConnect([{ path: 'runpage' }]),
  // map redux state to props
  // connect(({ firebase: { data } }) => ({
  //   runpage: data.runpage
  // })),
  // add props.router
  withRouter,
  // set prop-types used in enhancer
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    router: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  }),
  withHandlers(handlers)
)
