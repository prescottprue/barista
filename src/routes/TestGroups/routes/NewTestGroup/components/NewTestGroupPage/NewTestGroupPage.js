import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import NewTestGroupForm from '../NewTestGroupForm'

export const NewTestGroupPage = ({ classes, createNewTestGroup }) => (
  <div className={classes.root}>
    <div className={classes.titleBar}>
      <Typography variant="headline" component="h3">
        New Test Group
      </Typography>
    </div>
    <NewTestGroupForm onSubmit={createNewTestGroup} />
  </div>
)

NewTestGroupPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  createNewTestGroup: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewTestGroupPage
