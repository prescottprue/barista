import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

export const RuntimeSummary = ({ classes }) => (
  <Paper className={classes.container} elevation={0}>
    <Typography className={classes.label} component="p">
      CI:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      Gitlab **placeholder**
    </Typography>
    <Typography className={classes.label} component="p">
      OS:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      Linux Debian - 8.10
    </Typography>
    <Typography className={classes.label} component="p">
      Browser:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      Electron 59.0.3071.115
    </Typography>
    <Typography className={classes.label} component="p">
      Cypress:
    </Typography>
    <Typography className={classes.value} variant="body2" component="p">
      v3.0.1
    </Typography>
    <Typography className={classes.logs} variant="body2" component="p">
      view logs
    </Typography>
  </Paper>
)

RuntimeSummary.propTypes = {
  classes: PropTypes.object // from enhancer (withStyles)
}

export default RuntimeSummary
