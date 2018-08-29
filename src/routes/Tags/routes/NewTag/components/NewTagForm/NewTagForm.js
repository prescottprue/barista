import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { TextField, Checkbox } from 'redux-form-material-ui'
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
        <div className={classes.projects}>
          <Typography>Projects</Typography>
          <List>
            {projects.map(({ name }) => (
              <ListItem key={name} dense button className={classes.listItem}>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                  <Field name={`projects.${name}`} component={Checkbox} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
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
