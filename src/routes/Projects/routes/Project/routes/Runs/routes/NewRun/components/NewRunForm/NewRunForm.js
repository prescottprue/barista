import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { map, get, find } from 'lodash'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import BackIcon from '@material-ui/icons/ArrowBack'
import Paper from '@material-ui/core/Paper'
import SelectField from 'components/SelectField'
import ImageBuildStatus from 'routes/Projects/routes/Project/components/ImageBuildStatus'
import MostRecentImageInfo from 'routes/Projects/routes/Project/components/MostRecentImageInfo'
import Chip from '@material-ui/core/Chip'
import { TAGS_PATH } from 'constants'

const environmentOptions = [{ value: 'stage' }, { value: 'int' }]
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

export const NewRunForm = ({
  classes,
  handleSubmit,
  buildsPath,
  orderedTestGroups,
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
        {orderedTestGroups && orderedTestGroups.map ? (
          <div className={classes.testGroups}>
            <Typography>Test Groups</Typography>
            <SelectField
              name="testGroups"
              placeholder="Select Tag Group(s)"
              renderValue={selected => (
                <div className={classes.chips}>
                  {map(
                    typeof selected === 'string'
                      ? selected.split(',')
                      : selected,
                    (value, key) => {
                      const tagGroup = find(orderedTestGroups, { id: value })
                      return (
                        <Chip
                          key={`TestGroup-${value}-${get(
                            tagGroup,
                            'name',
                            value
                          )}`}
                          label={get(tagGroup, 'name', value)}
                          className={classes.chip}
                        />
                      )
                    }
                  )}
                </div>
              )}
              MenuProps={MenuProps}
              options={orderedTestGroups}
              multiple
            />
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
      </div>
      <div>
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
  orderedTestGroups: PropTypes.array, // from enhancer (connect)
  buildsPath: PropTypes.string.isRequired, // from enhancer (withProps)
  classes: PropTypes.object, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  runsPath: PropTypes.string.isRequired // from enhancer (withProps)
}

export default NewRunForm
