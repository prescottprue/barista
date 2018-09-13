import { createSelector } from '../utils'

describe('Projects Page', () => {
  before(() => {
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('/projects')
  })

  it.skip('creates project when provided a valid name', () => {
    const newProjectTitle = 'Test project'
    cy.get(createSelector('new-project-tile')).click()
    // Type name of new project into input
    cy.get(createSelector('new-project-name'))
      .find('input')
      .type(newProjectTitle)
    // Click on the new project button
    cy.get(createSelector('new-project-create-button')).click()
    // Query database for the just created project
    cy.callFirestore('get', 'projects', {
      where: [
        ['createdBy', '==', Cypress.env('TEST_UID')],
        ['name', '==', 'Test project']
      ],
      limit: 1
    }).then(([project]) => {
      // Confirm project has name
      cy.wrap(project)
        .its('data.name')
        .should('equal', 'Test project')
    })
  })

  it.skip('allows project to be deleted by project owner', () => {
    // click on the more button
    cy.get(createSelector('project-tile-more'))
      .first()
      .click()
    cy.get(createSelector('project-tile-delete')).click()
    // Confirm that new project is not available
    cy.get(createSelector('new-project-name')).should('not.exist')
  })
})
