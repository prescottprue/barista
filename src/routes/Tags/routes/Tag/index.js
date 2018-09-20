import { TAG_PATH as path } from 'constants'

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
        const TagPage = require('./components/TagPage').default

        /*  Return getComponent   */
        cb(null, TagPage)

        /* Webpack named bundle   */
      },
      'TagPage'
    )
  }
})
