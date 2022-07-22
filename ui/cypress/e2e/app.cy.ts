describe('Nation3 App UI', () => {

  it('should load the index page', () => {
    cy.visit('/')
    cy.get('h1').contains('Welcome to Nation3')
  }),

  it('should load the /join page', () => {
    cy.visit('/join')
    cy.get('h2').contains('Become a Nation3 citizen')
  }),

  it('should load the /claim page', () => {
    cy.visit('/claim')
    cy.get('h2').contains('$NATION tweetdrop')
  })
})

export {}
