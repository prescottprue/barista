import React from 'react'
import PropTypes from 'prop-types'
import { Typography, IconButton, Paper, Tooltip } from '@material-ui/core'
import { FileCopy } from '@material-ui/icons'
import classnames from 'classnames'

export const SourceCodeDetails = ({
  projectId,
  buildData,
  runMeta,
  openRepo,
  goToCommit,
  copyCommit,
  copyBuildId,
  goToBranch,
  shortenedSha,
  branchName,
  commitSha,
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
      onClick={goToBranch}
      className={classnames(classes.value, classes.link)}
      variant="body2"
      component="p">
      {branchName}
    </Typography>
    <Typography className={classes.label} component="p">
      Commit SHA:
    </Typography>
    <div className={classes.value}>
      <Tooltip title={commitSha}>
        <Typography
          onClick={goToCommit}
          className={classes.link}
          variant="body2"
          component="p">
          {shortenedSha}
        </Typography>
      </Tooltip>
      <Tooltip title={'copy commit sha'}>
        <IconButton
          aria-label="Copy Sha"
          onClick={copyCommit}
          classes={{ root: classes.copyButton }}
          disableRipple>
          <FileCopy classes={{ root: classes.copyIcon }} />
        </IconButton>
      </Tooltip>
    </div>
    <Typography className={classes.label} component="p">
      Build:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      {buildId}
      <Tooltip title={'copy image build id'}>
        <IconButton
          aria-label="Copy Sha"
          onClick={copyBuildId}
          classes={{ root: classes.copyButton }}
          disableRipple>
          <FileCopy classes={{ root: classes.copyIcon }} />
        </IconButton>
      </Tooltip>
    </Typography>
  </Paper>
)

SourceCodeDetails.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  projectId: PropTypes.string,
  branchName: PropTypes.string,
  commitSha: PropTypes.string,
  buildData: PropTypes.object,
  runMeta: PropTypes.object,
  buildId: PropTypes.string,
  openRepo: PropTypes.func,
  goToCommit: PropTypes.func,
  goToBranch: PropTypes.func,
  copyCommit: PropTypes.func,
  copyBuildId: PropTypes.func,
  shortenedSha: PropTypes.string
}

export default SourceCodeDetails
