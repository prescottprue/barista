import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { TextField, Checkbox } from 'redux-form-material-ui'
import { TAG_GROUPS_PATH, TAGS_PATH } from 'constants'

export const NewTagGroupForm = ({
  classes,
  handleSubmit,
  tags,
  projects,
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
      <Button
        variant="raised"
        color="primary"
        disabled={pristine || submitting}
        type="submit">
        Submit New Group
      </Button>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.inputs}>
        <Field fullWidth name="name" component={TextField} label="Name" />
        <Field
          fullWidth
          name="description"
          component={TextField}
          label="Description"
        />
        {tags && tags.map ? (
          <div>
            <Typography>Tags</Typography>
            <List>
              {tags.map(({ name, id }) => (
                <ListItem key={name} dense button className={classes.listItem}>
                  <ListItemText primary={name} />
                  <ListItemSecondaryAction>
                    <Field name={`tags.${id}`} component={Checkbox} />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <div className={classes.empty}>
            <p>Tags Required To Create a Tag Group</p>
            <Button
              variant="outlined"
              className={classes.createButton}
              component={Link}
              to={`${TAGS_PATH}/new`}>
              Create New Tag
            </Button>
          </div>
        )}
        <div className={classes.projects}>
          <Typography>Projects</Typography>
          <List>
            {projects.map(({ name, id }) => (
              <ListItem key={name} dense button className={classes.listItem}>
                <ListItemText primary={name} />
                <ListItemSecondaryAction>
                  <Field name={`projects.${id}`} component={Checkbox} />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </Paper>
  </form>
)

NewTagGroupForm.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  tags: PropTypes.array,
  projects: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewTagGroupForm
