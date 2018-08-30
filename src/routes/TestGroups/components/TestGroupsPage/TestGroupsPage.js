import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import BackIcon from '@material-ui/icons/ArrowBack'
import { TEST_GROUPS_PATH } from 'constants'
import TestGroupsTable from '../TestGroupsTable'

export const TestGroupsPage = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Test Groups
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Home">
        <IconButton component={Link} to="/">
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="outlined"
        className={classes.createButton}
        component={Link}
        to={`${TEST_GROUPS_PATH}/new`}>
        Create Test Group
      </Button>
    </div>
    <TestGroupsTable />
  </div>
)

TestGroupsPage.propTypes = {
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TestGroupsPage
