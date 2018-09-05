import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import classnames from 'classnames'

export const SourceCodeDetails = ({
  projectId,
  buildData,
  runMeta,
  openRepo,
  classes,
  buildId
}) => (
  <Paper className={classes.repo} elevation={0}>
    <Typography className={classes.label} component="p">
      Repo:
    </Typography>
    <Typography
      onClick={openRepo}
      className={classnames(classes.value, classes.link)}
      variant="body2"
      component="p">
      {buildData.projectId}
    </Typography>
    <Typography className={classes.label} component="p">
      Environment:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {runMeta.environment}
    </Typography>
    <Typography className={classes.label} component="p">
      Branch Name:
    </Typography>
    <Typography
      onClick={() =>
        window.open(
          `https://github.com/reside-eng/${projectId}/tree/${
            buildData.branchName
          }`
        )
      }
      className={classnames(classes.value, classes.link)}
      variant="body2"
      component="p">
      {buildData.branchName}
    </Typography>
    <Typography className={classes.label} component="p">
      Commit SHA:
    </Typography>
    <Tooltip title={buildData.commitSha || ''}>
      <Typography
        onClick={() =>
          window.open(
            `https://github.com/reside-eng/${projectId}/commit/${
              buildData.commitSha
            }`
          )
        }
        className={classnames(classes.value, classes.link)}
        variant="body2"
        component="p">
        {buildData.commitSha}
      </Typography>
    </Tooltip>
    <Typography className={classes.label} component="p">
      Build:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {buildId}
    </Typography>
  </Paper>
)

SourceCodeDetails.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  openRepo: PropTypes.func,
  projectId: PropTypes.string,
  buildData: PropTypes.object,
  runMeta: PropTypes.object,
  buildId: PropTypes.string
}

export default SourceCodeDetails
