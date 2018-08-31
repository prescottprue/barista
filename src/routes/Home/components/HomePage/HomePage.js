import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { LIST_PATH, TAGS_PATH, TEST_GROUPS_PATH } from 'constants'
import { startCase } from 'lodash'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const links = [
  { path: LIST_PATH, value: 'projects' },
  { path: TEST_GROUPS_PATH, value: 'testGroups' },
  { path: TAGS_PATH, value: 'tags' }
]

export const Home = ({ classes }) => (
  <div className={classes.root}>
    <Paper className={classes.paper} elevation={1} data-test="feature-links">
      <Typography variant="headline" component="h3">
        Remote Test Runner For Cypress and Mocha
      </Typography>
      <div className={classes.links}>
        {links.map((linkData, linkIndex) => (
          <Link
            to={linkData.path}
            key={`${linkIndex}-${linkData.value}`}
            data-test={`feature-${linkData.value}`}>
            <p>{startCase(linkData.value)}</p>
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
