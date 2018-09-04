import { createSelector } from '../utils'

describe('Projects Page', () => {
  /* eslint-disable no-unused-vars */
  let openSpy
  /* eslint-disable-line no-unused-vars */
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Create a server to listen to requests sent out to Google Auth and Firestore
    // cy.server({ whitelist: xhr => xhr.url.includes('identitytoolkit') })
    //   // Google get google account info (periodically called by Firebase JS SDK)
    //   .route('POST', /identitytoolkit\/v3\/relyingparty\/getAccountInfo/)
    //   .as('getGoogleAccountInfo')
    //   // Firebase JS SDK request - Called when listener attached
    //   .route('POST', /google.firestore.v1beta1.Firestore\/Listen/)
    //   .as('listenForProjects')
    //   // Firebase JS SDK request - Called when data is returned
    //   .route('GET', /google.firestore.v1beta1.Firestore\/Listen/)
    //   .as('getProjectData')
    //   // Firebase JS SDK request - Called when project data is written
    //   .route('POST', /google.firestore.v1beta1.Firestore\/Write/)
    //   .as('addProject')
    //   .window()
    //   .then(win => {
    //     // Create a spy on the servers onOpen event so we can later expect
    //     // it to be called with specific arguments
    //     openSpy = cy.spy(cy.state('server').options, 'onOpen')
    //     return null
    //   })
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
    // TODO: Use cy.callFirestore to confirm data
    // Confirm first project tile has title passed to new project input
    cy.get(createSelector('project-tile-name'))
      .first()
      .should('have.text', newProjectTitle)
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
