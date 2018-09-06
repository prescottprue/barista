import { createSelector } from '../utils'

describe('Home Page', () => {
  before(() => {
    // Go to home page
    cy.visit('/')
  })

  it('shows a "projects" button which goes to projects page (/projects)', () => {
    cy.get(createSelector('feature-projects'))
      .first()
      .click()
    cy.url().should('contain', '/projects')
  })

  it('shows a "testGroups" button goes to projects page', () => {
    cy.get(createSelector('feature-testGroups')).click()
  })

  it('shows a "tags" button goes to projects page', () => {
    cy.get(createSelector('feature-tags')).click()
  })
})
