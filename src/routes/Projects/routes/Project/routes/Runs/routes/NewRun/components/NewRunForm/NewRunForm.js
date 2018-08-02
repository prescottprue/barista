import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import SelectField from 'components/SelectField'

const environmentOptions = [{ value: 'stage' }, { value: 'prod' }]

export const NewRunForm = ({
  newRunForm,
  classes,
  handleSubmit,
  goBack,
  pristine,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton onClick={goBack}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="raised"
        color="primary"
        disabled={pristine || submitting}
        type="submit">
        Start New Run
      </Button>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.instructions}>
        <Typography>Select options for your new job run below</Typography>
      </div>
      <div className={classes.inputs}>
        <SelectField
          options={environmentOptions}
          name="environment"
          label="Select Run Environment"
        />
      </div>
    </Paper>
  </form>
)

NewRunForm.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  newRunForm: PropTypes.object, // from enhancer (firestoreConnect + connect)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  goBack: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewRunForm
