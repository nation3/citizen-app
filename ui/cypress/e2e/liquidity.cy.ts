describe('Liquidity', () => {

  it('stake: type a deposit amount', () => {
    cy.visit('/liquidity')

    // Expect default value to be '0'
    cy.get('#depositValue')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('0')
      })

    // Clear the default '0' value before typing a number
    cy.get('#depositValue').clear()
    
    // Type a number
    cy.get('#depositValue').type('3.3333')

    // Expect the value to no longer be '0'
    cy.get('#depositValue')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('3.3333')
      })
  })

  it('unstake: type a withdrawal amount', () => {
    cy.visit('/liquidity')

    // Click the "Unstake" tab
    cy.get("#unstakeTab").click()

    // Expect default value to be '0'
    cy.get('#withdrawalValue')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('0')
      })

    // Clear the default '0' value before typing a number
    cy.get('#withdrawalValue').clear()
    
    // Type a number
    cy.get('#withdrawalValue').type('0.3333')

    // Expect the value to no longer be '0'
    cy.get('#withdrawalValue')
      .invoke('val')
      .then(val => {
        expect(val).to.equal('0.3333')
      })
  })
})

export {}
