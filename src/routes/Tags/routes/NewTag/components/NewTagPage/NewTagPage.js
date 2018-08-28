import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import NewTagForm from '../NewTagForm'

export const NewTagPage = ({ classes, createNewTag }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        New Tag
      </Typography>
    </div>
    <NewTagForm onSubmit={createNewTag} />
  </div>
)

NewTagPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  createNewTag: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewTagPage
