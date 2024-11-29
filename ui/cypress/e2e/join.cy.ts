describe('Become a citizen', () => {
  
  it('click agreement link', () => {
    cy.visit('/join')

    cy.get('#agreementLink').click();

    // Expect the IPFS agreement text to be opened in a new browser window
    // Expected text: "By becoming a Nation3 citizen, I hereby agree to ..."
    // TO DO
  })
})

export {}
