import { TAGS_PATH as path } from 'constants'

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
        const TagsPage = require('./components/TagsPage').default

        /*  Return getComponent   */
        cb(null, TagsPage)

        /* Webpack named bundle   */
      },
      'TagsPage'
    )
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const NewTag = require('./routes/NewTag').default
      const Tag = require('./routes/Tag').default

      /*  Return getComponent   */
      cb(null, [NewTag(store), Tag(store)])
    })
  }
})
