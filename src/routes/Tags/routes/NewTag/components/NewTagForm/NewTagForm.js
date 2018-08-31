import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import { TextField } from 'redux-form-material-ui'
import { TAGS_PATH } from 'constants'

export const NewTagForm = ({
  classes,
  projects,
  handleSubmit,
  pristine,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Tags">
        <IconButton component={Link} to={TAGS_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="raised"
        color="primary"
        disabled={pristine || submitting}
        type="submit">
        Submit New Tag
      </Button>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.inputs}>
        <Field fullWidth name="name" component={TextField} label="Name" />
        <Field fullWidth name="value" component={TextField} label="Value" />
        <Field
          fullWidth
          name="description"
          component={TextField}
          label="Description"
        />
      </div>
    </Paper>
  </form>
)

NewTagForm.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  projects: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewTagForm
