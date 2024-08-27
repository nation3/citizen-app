describe('Liquidity', () => {
  beforeEach(() => {
    cy.visit('/liquidity')

    cy.intercept("GET", "https://api.coingecko.com/api/v3/simple/price?ids=nation3,ethereum&vs_currencies=usd", {
      body: {
        "ethereum": {
            "usd": 2672.05
        },
        "nation3": {
            "usd": 30.75
        }
      },
    });
  });

  it('stake: type a deposit amount', () => {

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
