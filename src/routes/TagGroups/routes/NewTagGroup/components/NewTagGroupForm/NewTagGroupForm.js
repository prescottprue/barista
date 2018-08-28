import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import { TextField } from 'redux-form-material-ui'
import { TAG_GROUPS_PATH } from 'constants'

export const NewTagGroupForm = ({
  classes,
  handleSubmit,
  pristine,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Tag Groups">
        <IconButton component={Link} to={TAG_GROUPS_PATH}>
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

NewTagGroupForm.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewTagGroupForm
