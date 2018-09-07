import React from 'react'
import PropTypes from 'prop-types'
import Highlight from 'react-highlight'
import classnames from 'classnames'
import Typography from '@material-ui/core/Typography'

export const TestError = ({ name, message, stack, classes }) => (
  <div className={classes.root}>
    <Typography variant="title" component="h4">
      Error Info
    </Typography>
    <Highlight
      className={classnames(
        'javascript',
        'atom-one-dark',
        classes.codeSection
      )}>
      {`${name}: ${message}`}
    </Highlight>
    <Typography variant="title" component="h4">
      Stacktrace
    </Typography>
    <Highlight className={classnames('bash', 'github', classes.codeSection)}>
      {stack}
    </Highlight>
  </div>
)

TestError.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  name: PropTypes.string,
  message: PropTypes.string,
  stack: PropTypes.string
}

export default TestError
