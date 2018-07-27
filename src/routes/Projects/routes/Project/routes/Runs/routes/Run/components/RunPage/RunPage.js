import React from 'react'
import PropTypes from 'prop-types'
import classes from './RunPage.scss'

export const RunPage = ({ runpage }) => (
  <div className={classes.container}>
    <span>RunPage Component</span>
    <pre>{JSON.stringify(runpage, null, 2)}</pre>
  </div>
)

RunPage.propTypes = {
  runpage: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default RunPage
