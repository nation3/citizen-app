describe('Lock tokens', () => {

  it('lock amount: type more than 18 decimals', () => {
    cy.visit('/lock')

    // Expect empty value
    cy.get('#lockAmount')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('')
      })

    // Type 19 decimals
    cy.get('#lockAmount').type('0.1919191919191919191')

    // Expect 18 decimals
    cy.get('#lockAmount')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('0.191919191919191919')
      })
  })
})

export {}
