import React from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import classes from './ProjectPage.scss'

const ProjectPage = ({ params, project, startTestRun }) => (
  <div className={classes.container}>
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title} component="h2">
          {project.name || 'Project'}
        </Typography>
        <Typography className={classes.subtitle}>{params.projectId}</Typography>
        <Button onClick={startTestRun}>Run Tests</Button>
        <div>
          <pre>{JSON.stringify(project, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  </div>
)

ProjectPage.propTypes = {
  project: PropTypes.object,
  startTestRun: PropTypes.func.isRequired, // from enhancer (withHandlers)
  params: PropTypes.object.isRequired
}

export default ProjectPage
