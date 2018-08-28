import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import { TextField } from 'redux-form-material-ui'
import { TAGS_PATH } from 'constants'

export const NewTagForm = ({ classes, handleSubmit, pristine, submitting }) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Tags">
        <IconButton component={Link} to={TAGS_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.inputs}>
        <Field fullWidth name="name" component={TextField} label="Name" />
        <Field fullWidth name="value" component={TextField} label="Value" />
      </div>
    </Paper>
  </form>
)

NewTagForm.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewTagForm
