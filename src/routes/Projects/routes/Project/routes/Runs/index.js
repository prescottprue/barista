import { RUNS_PATH as path } from 'constants'

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
        const Runs = require('./components/Runs').default

        /*  Return getComponent   */
        cb(null, Runs)

        /* Webpack named bundle   */
      },
      'Runs'
    )
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Run = require('./routes/Run').default
      const NewRun = require('./routes/NewRun').default

      /*  Return getComponent   */
      cb(null, [Run(store), NewRun(store)])
    })
  }
})
