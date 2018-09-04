import { createSelector } from '../utils'

describe('Projects Page', () => {
  let openSpy
  before(() => {
    // cy.server({
    //   whitelist: xhr => {
    //     if (xhr.url.includes('identitytoolkit/v3/relytingparty')) {
    //       return true
    //     }
    //     if (xhr.url.includes('google.firestore.v1beta1.Firestore/Listen')) {
    //       return true
    //     }
    //     if (xhr.url.includes('google.firestore.v1beta1.Firestore/Write')) {
    //       return true
    //     }
    //     return false
    //     console.log('xhr', xhr)
    //     // return xhr.url.includes('google.firestore.v1beta1.Firestore')
    //   }
    // })
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
    //     console.log('window:', window)
    //     return null
    //   })
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('/projects')
    cy.wait(3000)
    // cy.wait('@getProjectData')
  })

  it('creates project when provided a valid name', () => {
    const newProjectTitle = 'Test project'
    cy.get(createSelector('new-project-tile')).click()
    // Type name of new project into input
    cy.get(createSelector('new-project-name'))
      .find('input')
      .type(newProjectTitle)
    // Click on the new project button
    cy.get(createSelector('new-project-create-button')).click()
    // TODO: Use cy.callFirestore to confirm data
    cy.callFirestore('get', 'projects', {
      where: [
        ['createdBy', '==', Cypress.env('TEST_UID')],
        ['name', '==', 'Test project']
      ],
      limit: 1,
      onlyFirst: true
    })
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
