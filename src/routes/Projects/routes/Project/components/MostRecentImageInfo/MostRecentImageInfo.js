import React from 'react'
import PropTypes from 'prop-types'
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

export const MostRecentImageInfo = ({
  buildId,
  branchName,
  buildStatus,
  commitSha,
  classes,
  buildsPath
}) => (
  <div className={classes.root}>
    <Typography variant="headline" component="h3">
      Build Info
    </Typography>
    <div>Current Build Status: {iconFromStatus(buildStatus)}</div>
    <Typography variant="subheading" className={classes.subheader}>
      Most Recent Build
    </Typography>
    <Typography>Build Id: {buildId}</Typography>
    <Typography>Branch Name: {branchName}</Typography>
    <Typography>Commit Sha: {commitSha}</Typography>
  </div>
)

MostRecentImageInfo.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildStatus: PropTypes.string, // from enhancer (connect)
  buildId: PropTypes.string, // from enhancer (connect)
  branchName: PropTypes.string, // from enhancer (connect)
  commitSha: PropTypes.string, // from enhancer (connect)
  buildsPath: PropTypes.string.isRequired // from enhancer (connect)
}

export default MostRecentImageInfo
