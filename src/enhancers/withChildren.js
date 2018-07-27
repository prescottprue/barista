import { branch, renderComponent } from 'recompose'
import { cloneElement } from 'react'

export const withChildren = branch(
  ({ children }) => !!children,
  renderComponent(({ children, uid }) => cloneElement(children, { uid }))
)
