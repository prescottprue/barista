import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field, FieldArray } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { TEST_GROUPS_PATH } from 'constants'
import { formatDateTime } from 'utils/formatters'
import TestGroupFilePaths from 'routes/TestGroups/components/TestGroupFilePaths'

export const TestGroupPage = ({
  testGroup,
  testGroupId,
  classes,
  pristine,
  submitting,
  handleSubmit
}) => (
  <form className={classes.root} onSubmit={handleSubmit}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Test Group
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Test Groups">
        <IconButton component={Link} to={TEST_GROUPS_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </div>
    <Button
      variant="raised"
      color="primary"
      disabled={pristine || submitting}
      type="submit">
      Save
    </Button>
    <Paper className={classes.paper}>
      <div className={classes.info}>
        <Typography variant="subheading">
          Created: {formatDateTime(testGroup.createdAt)}
        </Typography>
        <Field fullWidth disabled name="id" component={TextField} label="ID" />
        <Field fullWidth name="name" component={TextField} label="Name" />
        <Field
          fullWidth
          name="description"
          component={TextField}
          label="Description"
        />
        <Typography variant="subheading">Projects</Typography>
        <Typography component="p">
          {Object.keys(testGroup.projects || {}).join(', ')}
        </Typography>
        <FieldArray name="filePaths" component={TestGroupFilePaths} />
      </div>
    </Paper>
  </form>
)

TestGroupPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  // description: PropTypes.string, // from enhancer (firestoreConnect + connect)
  // value: PropTypes.string, // from enhancer (firestoreConnect + connect)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  testGroup: PropTypes.object.isRequired,
  testGroupId: PropTypes.string.isRequired
}

export default TestGroupPage
