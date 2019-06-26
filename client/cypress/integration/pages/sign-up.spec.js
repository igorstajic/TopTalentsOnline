describe('New user sign up', () => {
  it('Should render login page', () => {
    cy.visit(`${Cypress.env('HOST')}/login`);
    cy.get('[data-test=page_container__login]').should('exist');
  });

  it('Should navigate to signup page', () => {
    cy.get('[data-test=link__signup]').click();
    cy.get('[data-test=page_container__signup]').should('exist');
  });

  it('Should fill and submit signup form', () => {
    cy.get('[data-test=input__firstName]')
      .type('Automated')
      .should('have.value', 'Automated');
    cy.get('[data-test=input__lastName]')
      .type('Testing')
      .should('have.value', 'Testing');
    cy.get('[data-test=input__email]')
      .type('automated_testing@test.com')
      .should('have.value', 'automated_testing@test.com');
    cy.get('[data-test=input__password]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-test=input__passwordConfirmation]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-test=action__submit]').click();
  });
  it('Should navigate to profile edit page', () => {
    cy.get('[data-test=page_container__profileEdit]').should('exist');
  });
});

describe('User log in and delete profile', () => {
  it('Should render login page', () => {
    cy.visit(`${Cypress.env('HOST')}/login`);
    cy.get('[data-test=page_container__login]').should('exist');
  });
  it('Should fill and submit login form', () => {
    cy.get('[data-test=input__email]')
      .type('automated_testing@test.com')
      .should('have.value', 'automated_testing@test.com');
    cy.get('[data-test=input__password]')
      .type('test1234')
      .should('have.value', 'test1234');
    cy.get('[data-test=action__submit]').click();
  });

  it('Should navigate to public profiles page', () => {
    cy.get('[data-test=page_container__publicProfiles]').should('exist');
  });

  it('Should delete profile', () => {
    cy.get('[data-test=action__showAccountMenu]').click();
    cy.get('[data-test=link__profileEdit]').click();
    cy.get('[data-test=page_container__profileEdit]').should('exist');
    cy.get('[data-test=action__delete]').click();
    cy.get('[data-test=action__confirmDelete]').click();

    cy.get('[data-test=page_container__login]').should('exist');
  });
});
