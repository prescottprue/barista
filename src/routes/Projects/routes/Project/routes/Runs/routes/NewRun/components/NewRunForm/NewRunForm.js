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
import Grid from '@material-ui/core/Grid'
import SelectField from 'components/SelectField'
import ImageBuildStatus from 'routes/Projects/routes/Project/components/ImageBuildStatus'
import MostRecentImageInfo from 'routes/Projects/routes/Project/components/MostRecentImageInfo'
import Chip from '@material-ui/core/Chip'
import { TAGS_PATH, LIST_PATH, RUNS_PATH, BUILDS_PATH } from 'constants'

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
  branchNames,
  orderedTestGroups,
  pristine,
  invalid,
  projectId,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.root}>
    <div className={classes.buttons}>
      <Tooltip title="Back To Runs">
        <IconButton
          component={Link}
          to={`${LIST_PATH}/${projectId}/${RUNS_PATH}`}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="raised"
        color="primary"
        disabled={pristine || invalid || submitting}
        type="submit">
        Start New Run
      </Button>
    </div>
    <Paper className={classes.paper}>
      <div className={classes.instructions} />
      <div className={classes.inputs}>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12}>
            <Typography>Environment Options</Typography>
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={3}>
            <SelectField
              options={environmentOptions}
              name="environment"
              label="App Environment"
              classes={{ root: classes.optionSection }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <SelectField
              options={branchNames}
              name="testCodeBranch"
              label="Test Code Branch"
              classes={{ root: classes.optionSection }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={3}>
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
                          const tagGroup = find(orderedTestGroups, {
                            id: value
                          })
                          return (
                            <Chip
                              key={`TestGroup-${value}-${get(
                                tagGroup,
                                'name',
                                key
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
                <p>No Tag Groups Found</p>
                <Button
                  variant="outlined"
                  className={classes.createButton}
                  component={Link}
                  to={`${TAGS_PATH}/new`}>
                  Create New Tag
                </Button>
              </div>
            )}
          </Grid>
        </Grid>
      </div>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={3}>
          <ImageBuildStatus projectId={projectId} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <MostRecentImageInfo projectId={projectId} />
        </Grid>
      </Grid>
      <div className={classes.button}>
        <Button
          component={Link}
          variant="outlined"
          to={`${LIST_PATH}/${projectId}/${BUILDS_PATH}`}>
          Go To Builds
        </Button>
      </div>
    </Paper>
  </form>
)

NewRunForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  orderedTestGroups: PropTypes.array, // from enhancer (connect)
  classes: PropTypes.object, // from enhancer (withStyles)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  branchNames: PropTypes.array.isRequired,
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  invalid: PropTypes.bool.isRequired // from enhancer (reduxForm)
}

export default NewRunForm
