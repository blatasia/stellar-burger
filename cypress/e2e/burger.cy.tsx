/// <reference types="cypress" />

const testUrl = 'http://localhost:4000';
const SELECTORS = {
  ingredientBun: '[data-cy="ingredient-bun"]',
  ingredientMain: '[data-cy="ingredient-main"]',
  ingredientSauce: '[data-cy="ingredient-sauce"]',
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  constructorElementText: 'div.constructor-element span.constructor-element__text',
  onOrderClick: '[data-cy="onOrderClick"]',
  orderNumber: '[data-cy="order-number"]'
}


describe('добавление ингредиентов', () => {

  beforeEach(() => {

    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getAuth');
  
    cy.visit(testUrl);
    cy.wait(['@getIngredients', '@getAuth']);

    cy.get(SELECTORS.ingredientBun).as('bunIngredients');
    cy.get(SELECTORS.ingredientMain).as('mainIngredients');
    cy.get(SELECTORS.ingredientSauce).as('sauceIngredients');
  });


  it('добавление ингредиентов', function() {

    //булки
    cy.get('@bunIngredients').contains('Добавить').click();
    cy.contains(SELECTORS.constructorElementText, 'Краторная булка N-200i (верх)').should('exist');
    cy.contains(SELECTORS.constructorElementText, 'Краторная булка N-200i (низ)').should('exist');

    //основа
    cy.get('@mainIngredients').contains('Добавить').click();
    cy.contains(SELECTORS.constructorElementText, 'Биокотлета из марсианской Магнолии').should('exist');

    //соус
    cy.get('@sauceIngredients').contains('Добавить').click();
    cy.contains(SELECTORS.constructorElementText, 'Соус Spicy-X').should('exist');
  });
});


describe('работа модального окна', () => {

  beforeEach(() => {

    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getAuth');
    
    cy.visit(testUrl);
    cy.wait(['@getIngredients', '@getAuth']);
  });

  
  it('модалка ингредиента', function() {
    cy.get(SELECTORS.ingredientBun).first().click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalClose).click();
    cy.get(SELECTORS.modal).should('not.exist');
    cy.get(SELECTORS.ingredientBun).first().click();
    cy.get(SELECTORS.modal).should('be.visible');
    cy.get(SELECTORS.modalOverlay).click({ force: true });
    cy.get(SELECTORS.modal).should('not.exist');
  });
});

describe('офрмление заказа', () => {

  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getAuth');
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' }).as('login');
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');

    //переход к авторизации
    cy.visit(`${testUrl}/login`);
    cy.wait(['@getIngredients', '@getAuth']);
  
    cy.setCookie('accessToken', 'accessToken');
    window.localStorage.setItem('refreshToken', 'refreshToken');

    cy.get('[data-cy="ingredient-bun"]').as('bunIngredients');
    cy.get('[data-cy="ingredient-main"]').as('mainIngredients');
    cy.get('[data-cy="ingredient-sauce"]').as('sauceIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  })

  it('создание заказа после авторизации', function() {

    //новая команда для добавления ингредиента
    cy.addIngredient('bun', 'Краторная булка N-200i (верх)');
    cy.addIngredient('main', 'Биокотлета из марсианской Магнолии');
    cy.addIngredient('sauce', 'Соус Spicy-X');

    cy.get(SELECTORS.onOrderClick).click();
    cy.wait('@createOrder');
    cy.get(SELECTORS.modal).should('exist');
    cy.get(SELECTORS.orderNumber).should('contain', '12345');
    cy.get(SELECTORS.modalClose).click();
  });
});
