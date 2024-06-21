import burgerReducer, {
  addToConstructor,
  removeFromConstructor,
  resetConstructor,
  moveItemUp,
  moveItemDown,
  orderBurger,
  TBurgerState
} from '../src/services/slices/burgerSlice'

import { TConstructorIngredient } from '../src/utils/types';
import { describe, expect, test } from '@jest/globals';

const bunMockData: TConstructorIngredient = {
  _id: 'bun-1',
  id: '1',
  name: 'Bun',
  type: 'bun',
  price: 1,
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  image: 'bun-image',
  image_mobile: 'bun-image-mobile',
  image_large: 'bun-image-large'
};

const ingredientMockData: TConstructorIngredient = {
  _id: 'ingredient-1',
  id: '2',
  name: 'Sauce',
  type: 'sauce',
  price: 1,
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  image: 'sauce-image',
  image_mobile: 'sauce-image-mobile',
  image_large: 'sauce-image-large'
};

const anotherIngredientMockData: TConstructorIngredient = {
  _id: 'ingredient-2',
  id: '3',
  name: 'Meat',
  type: 'main',
  price: 5,
  proteins: 50,
  fat: 10,
  carbohydrates: 20,
  calories: 500,
  image: 'meat-image',
  image_mobile: 'meat-image-mobile',
  image_large: 'meat-image-large'
};

describe('burgerSlice', () => {
  const initialState: TBurgerState = {
    loading: false,
    constructorItems: {
      bun: null,
      ingredients: []
    },
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  it('should handle initial state', () => {
    expect(burgerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addToConstructor (bun)', () => {
    const action = addToConstructor(bunMockData);
    const state = burgerReducer(initialState, action);
    expect(state.constructorItems.bun).toMatchObject({
      _id: bunMockData._id,
      name: bunMockData.name,
      type: bunMockData.type,
      price: bunMockData.price,
      proteins: bunMockData.proteins,
      fat: bunMockData.fat,
      carbohydrates: bunMockData.carbohydrates,
      calories: bunMockData.calories,
      image: bunMockData.image,
      image_mobile: bunMockData.image_mobile,
      image_large: bunMockData.image_large
    });
  });

  it('should handle addToConstructor (ingredient)', () => {
    const action = addToConstructor(ingredientMockData);
    const state = burgerReducer(initialState, action);
    expect(state.constructorItems.ingredients).toContainEqual(expect.objectContaining({
      _id: ingredientMockData._id,
      name: ingredientMockData.name,
      type: ingredientMockData.type,
      price: ingredientMockData.price,
      proteins: ingredientMockData.proteins,
      fat: ingredientMockData.fat,
      carbohydrates: ingredientMockData.carbohydrates,
      calories: ingredientMockData.calories,
      image: ingredientMockData.image,
      image_mobile: ingredientMockData.image_mobile,
      image_large: ingredientMockData.image_large,
      id: expect.any(String)
    }));
  });

  it('should handle removeFromConstructor', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredientMockData, anotherIngredientMockData]
      }
    };
    const action = removeFromConstructor(0);
    const state = burgerReducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients).toHaveLength(1);
    expect(state.constructorItems.ingredients).not.toContainEqual(ingredientMockData);
  });

  it('should handle moveItemUp', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredientMockData, anotherIngredientMockData]
      }
    };
    const action = moveItemUp(1);
    const state = burgerReducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients[0]).toEqual(anotherIngredientMockData);
    expect(state.constructorItems.ingredients[1]).toEqual(ingredientMockData);
  });

  it('should handle moveItemDown', () => {
    const stateWithIngredients = {
      ...initialState,
      constructorItems: {
        bun: null,
        ingredients: [ingredientMockData, anotherIngredientMockData]
      }
    };
    const action = moveItemDown(0);
    const state = burgerReducer(stateWithIngredients, action);
    expect(state.constructorItems.ingredients[0]).toEqual(anotherIngredientMockData);
    expect(state.constructorItems.ingredients[1]).toEqual(ingredientMockData);
  });

  it('should handle resetConstructor', () => {
    const stateWithItems = {
      ...initialState,
      constructorItems: {
        bun: bunMockData,
        ingredients: [ingredientMockData, anotherIngredientMockData]
      },
      orderModalData: { _id: 'order-123', status: 'done', name: 'Test Order', createdAt: '', updatedAt: '', number: 123, ingredients: [] }
    };
    const action = resetConstructor();
    const state = burgerReducer(stateWithItems, action);
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
    expect(state.orderModalData).toBeNull();
  });

  it('should handle orderBurger.pending', () => {
    const action = { type: orderBurger.pending.type };
    const state = burgerReducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle orderBurger.fulfilled', () => {
    const action = { type: orderBurger.fulfilled.type, payload: { order: { _id: 'order-123', status: 'done', name: 'Test Order', createdAt: '', updatedAt: '', number: 123, ingredients: [] } } };
    const stateWithItems = {
      ...initialState,
      constructorItems: {
        bun: bunMockData,
        ingredients: [ingredientMockData, anotherIngredientMockData]
      }
    };
    const state = burgerReducer(stateWithItems, action);
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual({ _id: 'order-123', status: 'done', name: 'Test Order', createdAt: '', updatedAt: '', number: 123, ingredients: [] });
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('should handle orderBurger.rejected', () => {
    const action = { type: orderBurger.rejected.type, error: { message: 'Order failed' } };
    const state = burgerReducer(initialState, action);
    expect(state.loading).toBe(false);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Order failed');
  });
});
