//типизация для команд

declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientType: string, ingredientName: string): Chainable<void>;
  }
}
