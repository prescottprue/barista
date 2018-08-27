import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import classes from './ProjectPage.scss'

const ProjectNotFound = () => (
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

export default ProjectNotFound
