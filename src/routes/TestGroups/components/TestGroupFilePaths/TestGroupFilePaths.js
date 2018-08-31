import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'

export const TestGroupFilePaths = ({
  classes,
  fields,
  meta: { error, submitFailed }
}) => (
  <List className={classes.root}>
    <Typography variant="subheading">Test Files</Typography>
    {submitFailed && error && <span>{error}</span>}
    {fields.map((member, index) => (
      <ListItem key={member} dense className={classes.listItem}>
        <Field
          name={member}
          fullWidth
          component={TextField}
          label="File Path"
        />
        <IconButton onClick={() => fields.remove(index)}>
          <CloseIcon />
        </IconButton>
      </ListItem>
    ))}
    <Button className={classes.createButton} onClick={() => fields.push()}>
      Add File Path
    </Button>
  </List>
)

TestGroupFilePaths.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  fields: PropTypes.object.isRequired, // from reduxFirestore
  meta: PropTypes.object.isRequired // from reduxFirestore
}

export default TestGroupFilePaths
