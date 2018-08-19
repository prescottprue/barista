import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import NewRunForm from '../NewRunForm'

export const NewRunPage = ({ classes, startTestRun, goBack, projectId }) => (
  <div className={classes.root}>
    <Typography variant="headline" component="h3">
      New Run
    </Typography>
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
