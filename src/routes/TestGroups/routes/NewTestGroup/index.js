import { NEW_TEST_GROUP_PATH as path } from 'constants'

export default store => ({
  path,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const NewTestGroupPage = require('./components/NewTestGroupPage')
          .default

        /*  Return getComponent   */
        cb(null, NewTestGroupPage)

        /* Webpack named bundle   */
      },
      'NewTestGroupPage'
    )
  }
})
