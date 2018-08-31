import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import { HOME_PATH, TAGS_PATH } from 'constants'
import BackIcon from '@material-ui/icons/ArrowBack'
import TagsTable from '../TagsTable'

export const TagsPage = ({ tags, classes }) => (
  <Grid className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        Tags
      </Typography>
    </div>
    <div className={classes.buttons}>
      <Tooltip title="Back To Home">
        <IconButton component={Link} to={HOME_PATH}>
          <BackIcon />
        </IconButton>
      </Tooltip>
      <Button
        variant="outlined"
        className={classes.createButton}
        component={Link}
        to={`${TAGS_PATH}/new`}>
        Create New Tag
      </Button>
    </div>
    <TagsTable />
  </Grid>
)

TagsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  tags: PropTypes.array // from enhancer (firestoreConnect + connect)
}

export default TagsPage
