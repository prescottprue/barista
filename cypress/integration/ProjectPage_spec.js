import { createSelector } from '../utils'

describe('Projects Page', () => {
  let open // eslint-disable-line no-unused-vars
  before(() => {
    cy.server()
      .route('POST', /identitytoolkit\/v3\/relyingparty\/getAccountInfo\//)
      .as('getAccountInfo')
      .route('POST', /identitytoolkit\/v3\/relyingparty\/verifyCustomToken\//)
      .as('verifyCustomToken')
      .route('POST', /google.firestore.v1beta1.Firestore\/Write\//)
      .as('addProject')
      .route('POST', /google.firestore.v1beta1.Firestore\/Listen\//)
      .as('listenForProjects')
      .route('GET', /google.firestore.v1beta1.Firestore\/Listen\//)
      .as('getProjectData')
      .window()
      .then(win => {
        open = cy.spy(cy.state('server').options, 'onOpen')
        return null
      })
    cy.visit('/')
    cy.login()
    // by default will wait 4sec for APP_READY prop to exist on
    cy.visit('/projects')
    cy.wait('@listenForProjects')
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile'), { timeout: 8000 }).click()
      // Type name of new project into input
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new project button
      cy.get(createSelector('new-project-create-button')).click()
      // Wait for request to Firebase to add project to return
      cy.wait('@addProject')
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Project', () => {
    it('allows project to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('project-tile-more'))
        .first()
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm that new project is not available
      cy.get(createSelector('new-project-name')).should('not.exist')
    })
  })
})
