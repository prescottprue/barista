import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { TAGS_PATH } from 'constants'
import { formatDateTime } from 'utils/formatters'

export const TagPage = ({
  tag,
  tagId,
  classes,
  pristine,
  submitting,
  handleSubmit
}) => (
  <form className={classes.root} onSubmit={handleSubmit}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Tag
      </Typography>
    </div>
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
        Save
      </Button>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.info}>
        <Typography variant="subheading">
          Created: {formatDateTime(tag.createdAt)}
        </Typography>
        <Field fullWidth disabled name="id" component={TextField} label="ID" />
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

TagPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  // description: PropTypes.string, // from enhancer (firestoreConnect + connect)
  // value: PropTypes.string, // from enhancer (firestoreConnect + connect)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  tag: PropTypes.object.isRequired,
  tagId: PropTypes.string.isRequired
}

export default TagPage
