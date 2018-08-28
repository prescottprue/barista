import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import NewTagGroupForm from '../NewTagGroupForm'

export const NewTagGroupPage = ({ classes, createNewTagGroup }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        New Tag Group
      </Typography>
    </div>
    <NewTagGroupForm onSubmit={createNewTagGroup} />
  </div>
)

NewTagGroupPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  createNewTagGroup: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewTagGroupPage
