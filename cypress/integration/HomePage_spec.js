describe('Goes to login page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })
  it('goes to login page', () => {
    cy.url().should('include', '/transactions/listings')
  })
})
