import { createSelector } from '../utils'

describe('Home Page', () => {
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Go to projects page
    cy.visit('/')
  })

  it('shows features', () => {
    cy.get(createSelector('features')).exists()
  })
})
