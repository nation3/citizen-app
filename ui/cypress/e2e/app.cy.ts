describe('Navigation', () => {
  it('should navigate to the join page', () => {
    // Start from the index page
    cy.visit('/')

    // The index page should contain an h1 with "Welcome to Nation3"
    cy.get('h1').contains('Welcome to Nation3')

    // Find a link with an href attribute containing "join" and click it
    cy.get('a[href*="join"]').click()

    // The new url should include "/join"
    cy.url().should('include', '/join')

    // The new page should contain an h2 with "Become a Nation3 citizen"
    cy.get('h2').contains('Become a Nation3 citizen')
  })
})
