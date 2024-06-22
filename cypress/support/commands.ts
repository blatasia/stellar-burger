/// <reference types="cypress" />

//добавление ингредиента
Cypress.Commands.add('addIngredient', (ingredientType, ingredientName) => {
  cy.get(`[data-cy="ingredient-${ingredientType}"]`).contains('Добавить').click();
  cy.contains('div.constructor-element span.constructor-element__text', ingredientName).should('exist');
})
