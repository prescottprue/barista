import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field, FieldArray } from 'redux-form'
import { TextField, Checkbox } from 'redux-form-material-ui'
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
import { TEST_GROUPS_PATH, TAGS_PATH } from 'constants'
import TestGroupFilePaths from 'routes/TestGroups/components/TestGroupFilePaths'

export const NewTestGroupForm = ({
  classes,
  handleSubmit,
  tags,
  testFiles,
  projects,
  pristine,
  array,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Tag Groups">
        <IconButton component={Link} to={TEST_GROUPS_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="raised"
        color="primary"
        disabled={pristine || submitting}
        type="submit">
        Save New Group
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
        <FieldArray name="filePaths" component={TestGroupFilePaths} />
        {testFiles && testFiles.map ? (
          <div>
            <Typography variant="subheading">File Suggestions</Typography>
            <Typography component="p">Barista</Typography>
            <List>
              {testFiles.map(({ name = '', id }) => (
                <ListItem
                  key={name}
                  dense
                  button
                  className={classes.listItem}
                  onClick={() => array.push('filePaths', name)}>
                  <ListItemText primary={name} />
                </ListItem>
              ))}
            </List>
          </div>
        ) : null}
        {tags && tags.map ? (
          <div>
            <Typography>Tags (not currently supported by Cypress)</Typography>
            <List>
              {tags.map(({ name, value, id }) => (
                <ListItem key={name} dense button className={classes.listItem}>
                  <ListItemText
                    primary={name}
                    secondary={`(${value || name})`}
                  />
                  <ListItemSecondaryAction>
                    <Field name={`tags.${id}`} component={Checkbox} />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        ) : (
          <div className={classes.empty}>
            <p>No Tag groups found</p>
            <Button
              variant="outlined"
              className={classes.createButton}
              component={Link}
              to={`${TAGS_PATH}/new`}>
              Create New Tag
            </Button>
          </div>
        )}
      </div>
    </Paper>
  </form>
)

NewTestGroupForm.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  array: PropTypes.object.isRequired, // from enhancer (reduxForm)
  tags: PropTypes.array, // from enhancer (connect)
  projects: PropTypes.array, // from enhancer (connect)
  testFiles: PropTypes.array, // from enhancer (connect)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewTestGroupForm
