import ingredientsReducer, {
  fetchIngredients,
  selectIngredients,
  selectIngredientsStatus,
  TIngredientsState
} from '../src/services/slices/ingredientsSlice';
import { TIngredient } from '../src/utils/types';
import { RootState } from '../src/services/store';

const ingredientsMockData: TIngredient[] = [
  {
    _id: '1',
    name: 'Ingredient 1',
    type: 'main',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 40,
    price: 50,
    image: 'image1.png',
    image_mobile: 'image1_mobile.png',
    image_large: 'image1_large.png',
  },
  {
    _id: '2',
    name: 'Ingredient 2',
    type: 'sauce',
    proteins: 15,
    fat: 25,
    carbohydrates: 35,
    calories: 45,
    price: 55,
    image: 'image2.png',
    image_mobile: 'image2_mobile.png',
    image_large: 'image2_large.png',
  }
];

const initialState: TIngredientsState = {
  items: [],
  status: 'idle',
  error: null
};

describe('ingredientsSlice', () => {
  it('should handle initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: ingredientsMockData
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(ingredientsMockData);
  });

  it('should handle fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Fetch failed' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Fetch failed');
  });

  it('selectIngredients should return ingredients', () => {
    const rootState = { ingredients: { ...initialState, items: ingredientsMockData } };
    expect(selectIngredients(rootState as RootState)).toEqual(ingredientsMockData);
  });

  it('selectIngredientsStatus should return status', () => {
    const rootState = { ingredients: initialState };
    expect(selectIngredientsStatus(rootState as RootState)).toEqual(initialState.status);
  });
});
