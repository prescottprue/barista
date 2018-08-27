import { BUILDS_PATH as path } from 'constants'

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
        const Builds = require('./components/Builds').default

        /*  Return getComponent   */
        cb(null, Builds)

        /* Webpack named bundle   */
      },
      'Builds'
    )
  }
})
