import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

export const MostRecentImageInfo = ({
  buildId,
  branchName,
  commitSha,
  classes,
  buildsPath
}) => (
  <div className={classes.root}>
    <Typography>Build Id: {buildId}</Typography>
    <Typography>Branch Name: {branchName}</Typography>
    <Typography>Commit Sha: {commitSha}</Typography>
    <div className={classes.button}>
      <Button component={Link} variant="outlined" to={buildsPath}>
        Go To Builds
      </Button>
    </div>
  </div>
)

MostRecentImageInfo.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  buildId: PropTypes.string, // from enhancer (connect)
  branchName: PropTypes.string, // from enhancer (connect)
  commitSha: PropTypes.string, // from enhancer (connect)
  buildsPath: PropTypes.string.isRequired // from enhancer (connect)
}

export default MostRecentImageInfo
