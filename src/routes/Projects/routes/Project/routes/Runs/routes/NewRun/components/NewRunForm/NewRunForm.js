import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import SelectField from 'components/SelectField'
import ImageBuildStatus from 'routes/Projects/routes/Project/components/ImageBuildStatus'
import MostRecentImageInfo from 'routes/Projects/routes/Project/components/MostRecentImageInfo'

const environmentOptions = [{ value: 'stage' }, { value: 'int' }]

export const NewRunForm = ({
  newRunForm,
  classes,
  handleSubmit,
  buildsPath,
  runsPath,
  pristine,
  projectId,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton component={Link} to={runsPath}>
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
        <ImageBuildStatus projectId={projectId} />
        <MostRecentImageInfo projectId={projectId} />
        <div className={classes.button}>
          <Button component={Link} variant="outlined" to={buildsPath}>
            Go To Builds
          </Button>
        </div>
      </div>
    </Paper>
  </form>
)

NewRunForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  buildsPath: PropTypes.string.isRequired, // from enhancer (withProps)
  classes: PropTypes.object, // from enhancer (withStyles)
  newRunForm: PropTypes.object, // from enhancer (firestoreConnect + connect)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  runsPath: PropTypes.string.isRequired // from enhancer (withProps)
}

export default NewRunForm
