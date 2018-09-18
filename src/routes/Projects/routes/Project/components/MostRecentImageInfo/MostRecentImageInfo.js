import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { formatDateTime } from 'utils/formatters'

export const MostRecentImageInfo = ({
  buildId,
  branchName,
  buildStatus,
  commitSha,
  updatedAt,
  classes
}) => (
  <div className={classes.root}>
    <Typography>Build Id: {buildId}</Typography>
    <Typography>Branch Name: {branchName}</Typography>
    <Typography>Commit Sha: {commitSha}</Typography>
    <Typography>Updated At: {formatDateTime(updatedAt)}</Typography>
  </div>
)

MostRecentImageInfo.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildStatus: PropTypes.string, // from enhancer (connect)
  buildId: PropTypes.string, // from enhancer (connect)
  branchName: PropTypes.string, // from enhancer (connect)
  commitSha: PropTypes.string, // from enhancer (connect)
  updatedAt: PropTypes.object
}

export default MostRecentImageInfo
