import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { Field } from 'redux-form'
import { Select } from 'redux-form-material-ui'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'

export const SelectField = ({ selectField, name, label, options, classes }) => (
  <FormControl className={classes.field}>
    <InputLabel htmlFor="resource">{label}</InputLabel>
    <Field
      name={name}
      component={Select}
      fullWidth
      inputProps={{
        name: 'resource',
        id: 'resource'
      }}>
      {options.map((option, idx) => (
        <MenuItem
          key={`Option-${option.value}-${idx}`}
          value={option.value}
          disabled={option.disabled}>
          <ListItemText primary={option.label || capitalize(option.value)} />
        </MenuItem>
      ))}
    </Field>
  </FormControl>
)

SelectField.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  selectField: PropTypes.object // from enhancer (firestoreConnect + connect)
}

SelectField.defaultProps = {
  label: 'Select'
}

export default SelectField
