describe('New user sign up', () => {
  it('Should render login page', () => {
    cy.visit(`${Cypress.env('HOST')}/login`);
    cy.get('[data-testid=page_container__login]').should('exist');
  });

  it('Should navigate to signup page', () => {
    cy.get('[data-testid=link__signup]').click();
    cy.get('[data-testid=page_container__signup]').should('exist');
  });

  it('Should fill and submit signup form', () => {
    cy.get('[data-testid=input__firstName]')
      .type('Automated')
      .should('have.value', 'Automated');
    cy.get('[data-testid=input__lastName]')
      .type('Testing')
      .should('have.value', 'Testing');
    cy.get('[data-testid=input__email]')
      .type('automated_testing@test.com')
      .should('have.value', 'automated_testing@test.com');
    cy.get('[data-testid=input__password]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-testid=input__passwordConfirmation]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-testid=action__submit]').click();
  });
  it('Should navigate to profile edit page', () => {
    cy.get('[data-testid=page_container__profileEdit]').should('exist');
  });
});

describe('User log in and delete profile', () => {
  it('Should render login page', () => {
    cy.visit(`${Cypress.env('HOST')}/login`);
    cy.get('[data-testid=page_container__login]').should('exist');
  });
  it('Should fill and submit login form', () => {
    cy.get('[data-testid=input__email]')
      .type('automated_testing@test.com')
      .should('have.value', 'automated_testing@test.com');
    cy.get('[data-testid=input__password]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-testid=action__submit]').click();
  });

  it('Should navigate to public profiles page', () => {
    cy.get('[data-testid=page_container__publicProfiles]').should('exist');
  });

  it('Should delete profile', () => {
    cy.get('[data-testid=action__showAccountMenu]').click();
    cy.get('[data-testid=link__profileEdit]').click();
    cy.get('[data-testid=page_container__profileEdit]').should('exist');
    cy.get('[data-testid=action__delete]').click();
    cy.get('[data-testid=action__confirmDelete]').click();

    cy.get('[data-testid=page_container__login]').should('exist');
  });
});
