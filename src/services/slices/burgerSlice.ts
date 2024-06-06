import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
import { nanoid } from 'nanoid';
import { RootState } from '../store';

interface TBurgerState {
  loading: boolean;
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

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

export const orderBurger = createAsyncThunk(
  'burger/order',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addToConstructor: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeFromConstructor(state, action: PayloadAction<number>) {
      state.constructorItems.ingredients.splice(action.payload, 1);
    },
    resetConstructor(state) {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];

      state.orderModalData = null;
    },
    moveItemUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index > 0 && index < state.constructorItems.ingredients.length) {
        const temp = state.constructorItems.ingredients[index - 1];
        state.constructorItems.ingredients[index - 1] =
          state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] = temp;
      }
    },
    moveItemDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.constructorItems.ingredients.length - 1) {
        const temp = state.constructorItems.ingredients[index + 1];
        state.constructorItems.ingredients[index + 1] =
          state.constructorItems.ingredients[index];
        state.constructorItems.ingredients[index] = temp;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.loading = true;
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
        state.constructorItems = {
          bun: null,
          ingredients: []
        };
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.loading = false;
        state.orderRequest = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export const {
  addToConstructor,
  removeFromConstructor,
  resetConstructor,
  moveItemUp,
  moveItemDown
} = burgerSlice.actions;

export const selectBurger = (state: RootState) => state.burger.constructorItems;

export default burgerSlice.reducer;
