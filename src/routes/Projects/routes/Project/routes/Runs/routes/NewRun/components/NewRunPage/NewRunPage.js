import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import Typography from '@material-ui/core/Typography'
import NewRunForm from '../NewRunForm'

export const NewRunPage = ({ classes, startTestRun, goBack, projectId }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        New {startCase(projectId)} Job Run
      </Typography>
    </div>
    <NewRunForm onSubmit={startTestRun} projectId={projectId} />
  </div>
)

NewRunPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  startTestRun: PropTypes.func.isRequired, // from enhancer (withHandlers)
  goBack: PropTypes.func.isRequired, // from enhancer (withHandlers)
  projectId: PropTypes.string.isRequired
}

export default NewRunPage
