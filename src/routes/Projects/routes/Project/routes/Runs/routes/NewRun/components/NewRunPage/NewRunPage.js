import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import Paper from '@material-ui/core/Paper'
import BackIcon from '@material-ui/icons/ArrowBack'

export const NewRunPage = ({ classes, startTestRun, goBack }) => (
  <div className={classes.root}>
    <Typography variant="headline" component="h3">
      New Run
    </Typography>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton onClick={goBack}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button variant="raised" color="primary" disabled onClick={startTestRun}>
        Start New Run
      </Button>
    </div>
    <Paper className={classes.paper}>
      <span>New Run Page</span>
    </Paper>
  </div>
)

NewRunPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  startTestRun: PropTypes.func.isRequired, // from enhancer (withHandlers)
  goBack: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewRunPage
