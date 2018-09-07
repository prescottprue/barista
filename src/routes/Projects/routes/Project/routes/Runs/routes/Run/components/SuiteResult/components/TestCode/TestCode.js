import React from 'react'
import PropTypes from 'prop-types'
import Highlight from 'react-highlight'
import { Paper, Typography } from '@material-ui/core'

export const TestCode = ({ testCode, classes }) => (
  <Paper elevation={0} classes={{ root: classes.root }}>
    <Typography
      variant="title"
      component="h4"
      classes={{ root: classes.title }}>
      Test Source Code
    </Typography>
    <Highlight
      className="javascript atom-one-dark"
      style={{ display: 'block' }}>
      {testCode}
    </Highlight>
  </Paper>
)

TestCode.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  testCode: PropTypes.string // from enhancer (firestoreConnect + connect)
}

export default TestCode
