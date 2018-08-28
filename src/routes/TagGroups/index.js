import { TAG_GROUPS_PATH as path } from 'constants'

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
        const TagGroupsPage = require('./components/TagGroupsPage').default

        /*  Return getComponent   */
        cb(null, TagGroupsPage)

        /* Webpack named bundle   */
      },
      'TagGroupsPage'
    )
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const NewTagGroup = require('./routes/NewTagGroup').default

      /*  Return getComponent   */
      cb(null, [NewTagGroup(store)])
    })
  }
})
