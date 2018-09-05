import React from 'react'
import PropTypes from 'prop-types'
import {
  Error as ErrorIcon,
  CheckCircle,
  Warning,
  Replay as Rerun,
  RemoveCircleOutline as Skip
} from '@material-ui/icons'

export const IconFromStatus = ({ status, classes, context, runResult }) => {
  switch (true) {
    case status === 'failed':
    case status === 'pending' && runResult === 'failed':
      return <ErrorIcon color="error" classes={{ root: classes.root }} />
    case status === 'passed':
      return (
        <CheckCircle
          className={classes.pass}
          classes={{ root: classes.root }}
        />
      )
    case status === 'pending' && context === 'test':
      return (
        <Skip
          color="disabled"
          className={classes.skip}
          classes={{ root: classes.root }}
        />
      )
    case status === 'pending':
      return (
        <Rerun
          color="disabled"
          className={classes.pending}
          classes={{ root: classes.root }}
        />
      )
    default:
      return <Warning />
  }
}

IconFromStatus.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  status: PropTypes.string.isRequired,
  context: PropTypes.string,
  runResult: PropTypes.string
}

export default IconFromStatus
