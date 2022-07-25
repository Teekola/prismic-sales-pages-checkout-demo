/// <reference types="cypress" />

describe('Homepage Test', () => {
   beforeEach(() => {
      // Cypress starts out with a blank state for each test
      // so we must tell it to visit our website with the `cy.visit()` command.
      // Since we want to visit the same URL at the start of all our tests,
      // we include it in our beforeEach function so that it runs before each test
      cy.visit('http://localhost:3000/')
   });

   it("h1 has correct text", () => {
      cy
         .get("h1")
         .should("have.text", "NextJS Start Template");
   });
})
