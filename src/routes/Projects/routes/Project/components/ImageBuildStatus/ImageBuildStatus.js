import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import SuccessIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'

function iconFromStatus(status) {
  switch (status) {
    case 'SUCCESS':
      return <SuccessIcon />
    case 'WORKING':
      return <CircularProgress size={20} />
    default:
      return <ErrorIcon />
  }
}

export const ImageBuildStatus = ({ branchName, buildStatus, classes }) => (
  <div className={classes.root}>
    <Typography variant="subheading">Image Build Status</Typography>
    <div>Status: {iconFromStatus(get(buildStatus, 'status'))}</div>
    <div>Branch: {get(buildStatus, 'branchName')}</div>
  </div>
)

ImageBuildStatus.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildStatus: PropTypes.shape({
    status: PropTypes.string
  }), // from enhancer (connect)
  branchName: PropTypes.string // from enhancer (connect)
}

export default ImageBuildStatus
