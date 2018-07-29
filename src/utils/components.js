import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pick, some } from 'lodash'
import { isLoaded } from 'react-redux-firebase'
import { mapProps, branch, renderComponent } from 'recompose'
import LoadingSpinner from 'components/LoadingSpinner'

/**
 * Show a loading spinner when a condition is truthy. Used within
 * spinnerWhileLoading. Accepts a test function and a higher-order component.
 * @param  {Function} condition - Condition function for when to show spinner
 * @return {HigherOrderComponent}
 */
export function spinnerWhile(condition) {
  return branch(condition, renderComponent(LoadingSpinner))
}

/**
 * Show a loading spinner while props are loading . Checks
 * for undefined, null, or a value (as well as handling `auth.isLoaded` and
 * `profile.isLoaded`). **NOTE:** Meant to be used with props which are passed
 * as props from state.firebase using connect (from react-redux), which means
 * it could have unexpected results for other props
 * @example Spinner While Data Loading
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   firebaseConnect(['projects']),
 *   connect(({ firebase: { data: { projects } } })),
 *   spinnerWhileLoading(['projects'])
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to check loading for
 * @return {HigherOrderComponent}
 */
export function spinnerWhileLoading(propNames) {
  return spinnerWhile(props => some(propNames, name => !isLoaded(props[name])))
}

/**
 * HOC that logs props using console.log. Accepts an array list of prop names
 * to log, if none provided all props are logged. **NOTE:** Only props at
 * available to the HOC will be logged.
 * @example Log Single Prop
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   withProps(() => ({ projectName: 'test' })),
 *   logProps(['projectName']) // 'test' would be logged to console when SomeComponent is rendered
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to log. If none provided, all
 * are logged
 * @return {HigherOrderComponent}
 */
export function logProps(propNames, logName = '') {
  return mapProps(ownerProps => {
    /* eslint-disable no-console */
    console.log(
      `${logName} props:`,
      propNames ? pick(ownerProps, propNames) : ownerProps
    )
    /* eslint-enable no-console */
    return ownerProps
  })
}

/**
 * Function which creates a HOC which gets a variable
 * @param  {String} withVar - Name of variable to get from context
 * @return {Component} React Higher Order Component
 * @example Basic
 * export const withRouter = createWithFromContext('router')
 * // withRouter is an HOC that passes context.router as props.router
 */
export function createWithFromContext(withVar) {
  return WrappedComponent => {
    class WithFromContext extends Component {
      render() {
        const props = { [withVar]: this.context[withVar] }
        if (this.context.store && this.context.store.dispatch) {
          props.dispatch = this.context.store.dispatch
        }
        return <WrappedComponent {...this.props} {...props} />
      }
    }

    WithFromContext.contextTypes = {
      [withVar]: PropTypes.object.isRequired
    }

    return WithFromContext
  }
}

/**
 * HOC that adds router to props (from context)
 * @return {HigherOrderComponent}
 */
export const withRouter = createWithFromContext('router')

/**
 * HOC that adds store to props (from context)
 * @return {HigherOrderComponent}
 */
export const withStore = createWithFromContext('store')
