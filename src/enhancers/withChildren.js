import { branch, renderComponent } from 'recompose'
import { cloneElement } from 'react'

export const withChildren = branch(
  ({ children }) => !!children,
  renderComponent(({ children, uid, projectId }) =>
    cloneElement(children, { uid, projectId })
  )
)
