import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { paths } from 'constants'
import { startCase } from 'lodash'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const links = [
  { path: paths.list, value: 'projects' },
  { path: paths.tags, value: 'tags' },
  { path: paths.tagGroups, value: 'tagGroups' }
]

export const Home = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper} elevation={1} data-test="features">
      <Typography variant="headline" component="h3">
        Remote Test Runner For Cypress and Mocha
      </Typography>
      <Typography component="p" color="textSecondary">
        More Coming Soon
      </Typography>
      <div className={classes.links}>
        {links.map((linkData, linkIndex) => (
          <Link to={linkData.path} key={`${linkIndex}-${linkData.value}`}>
            <p>View {startCase(linkData.value)}</p>
          </Link>
        ))}
      </div>
    </Paper>
  </div>
)

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default Home
