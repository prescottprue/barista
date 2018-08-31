import { TEST_GROUPS_PATH as path } from 'constants'

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
        const TestGroupsPage = require('./components/TestGroupsPage').default

        /*  Return getComponent   */
        cb(null, TestGroupsPage)

        /* Webpack named bundle   */
      },
      'TestGroupsPage'
    )
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const NewTestGroup = require('./routes/NewTestGroup').default
      const TestGroup = require('./routes/TestGroup').default

      /*  Return getComponent   */
      cb(null, [NewTestGroup(store), TestGroup(store)])
    })
  }
})
