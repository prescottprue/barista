import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

export const MostRecentImageInfo = ({
  buildId,
  branchName,
  buildStatus,
  commitSha,
  classes
}) => (
  <div className={classes.root}>
    <Typography variant="subheading" className={classes.subheader}>
      Current Image Info
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
  commitSha: PropTypes.string // from enhancer (connect)
}

export default MostRecentImageInfo
