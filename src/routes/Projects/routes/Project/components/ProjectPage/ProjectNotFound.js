import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import classes from './ProjectPage.scss'

const ProjectNotFound = ({ params, project, startTestRun }) => (
  <div className={classes.container}>
    <Card className={classes.card}>
      <CardContent className={classes.content}>
        <Typography>Not Found</Typography>
        <Typography>
          Project could not be found. Check the name and confirm that the
          project has been shared with you
        </Typography>
      </CardContent>
    </Card>
  </div>
)

ProjectNotFound.propTypes = {
  project: PropTypes.object,
  startTestRun: PropTypes.func.isRequired, // from enhancer (withHandlers)
  params: PropTypes.object.isRequired
}

export default ProjectNotFound
