import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, isString } from 'lodash'
import { Field } from 'redux-form'
import FormControl from '@material-ui/core/FormControl'
import { Select } from 'redux-form-material-ui'
import SelectComponent from './SelectComponent'
import InputLabel from '@material-ui/core/InputLabel'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'

export const SelectField = ({
  selectField,
  name,
  label,
  options,
  classes,
  ...other
}) => (
  <div className={classes.root}>
    <FormControl
      className={other.multiple ? classes.multiField : classes.field}>
      <InputLabel htmlFor="resource">{label}</InputLabel>
      <Field
        name={name}
        // Only use custom component when multiple is in use since
        // redux-form-material-ui does not currently support multi
        component={other.multiple ? SelectComponent : Select}
        fullWidth
        inputProps={{
          name: 'resource',
          id: 'resource'
        }}
        {...other}>
        {options.map((option, idx) => (
          <MenuItem
            key={`Option-${name}-${option.value}-${idx}`}
            value={isString(option) ? option : option.value || option.id}
            disabled={option.disabled}>
            <ListItemText
              primary={
                isString(option)
                  ? option
                  : option.name || option.label || capitalize(option.value)
              }
            />
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  </div>
)

SelectField.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  selectField: PropTypes.object // from enhancer (firestoreConnect + connect)
}

SelectField.defaultProps = {
  label: 'Select'
}

export default SelectField
