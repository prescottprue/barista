import { RUN_PATH as path } from 'constants'

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
        const RunPage = require('./components/RunPage').default

        /*  Return getComponent   */
        cb(null, RunPage)

        /* Webpack named bundle   */
      },
      'Run'
    )
  }
})
