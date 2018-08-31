import { Component, createElement } from 'react'
import Select from '@material-ui/core/Select'

// TODO: REMOVE THE FOLLOWING SECTION ONCE redux-form-material-ui supports
// multi inputs
export const isStateLess = Component => !Component.prototype.render
const mapError = ({
  hasHelperText = true,
  meta: { touched, error, warning } = {},
  input,
  ...props
}) => {
  const errorProps =
    touched && (error || warning)
      ? {
          ...props,
          ...input,
          error: Boolean(error || warning)
        }
      : { ...input, ...props }

  if (touched && hasHelperText && (error || warning)) {
    errorProps.helperText = error || warning
  }

  return errorProps
}
/**
 * Creates a component class that renders the given Material UI component
 * @param MaterialUIComponent The material ui component to render
 * @param mapProps A mapping of props provided by redux-form to the props the Material UI
 * component needs
 */
function createComponent(MaterialUIComponent, mapProps) {
  class InputComponent extends Component {
    getRenderedComponent() {
      return this.component
    }

    render() {
      return createElement(MaterialUIComponent, {
        ...mapProps(this.props),
        ref: !isStateLess(MaterialUIComponent)
          ? el => (this.component = el)
          : null
      })
    }
  }
  InputComponent.displayName = `ReduxFormMaterialUI${MaterialUIComponent.name}`
  return InputComponent
}

const SelectComponent = createComponent(
  Select,
  ({
    input: { onChange, value, onBlur, ...inputProps },
    onChange: onChangeFromField,
    defaultValue,
    ...props
  }) => ({
    ...mapError({ ...props, hasHelperText: false }),
    ...inputProps,
    value: props.multiple && !Array.isArray(value) ? [] : value,
    onChange: event => {
      onChange(event.target.value)
      if (onChangeFromField) {
        onChangeFromField(event.target.value)
      }
    },
    onBlur: () => onBlur(value)
  })
)

export default SelectComponent
