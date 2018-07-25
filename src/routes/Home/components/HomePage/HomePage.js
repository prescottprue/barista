import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { paths } from 'constants'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

export const Home = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper} elevation={1}>
      <Typography variant="headline" component="h3">
        Remote Test Runner For Cypress and Mocha
      </Typography>
      <Typography component="p" color="textSecondary">
        More Coming Soon
      </Typography>
      <div className={classes.links}>
        <Link to={paths.list}>
          <p>View Projects</p>
        </Link>
      </div>
    </Paper>
  </div>
)

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default Home
