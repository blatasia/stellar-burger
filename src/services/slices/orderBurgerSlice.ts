import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export interface TOrderBurgerState {
  order: TOrder | null;
  requestStatus: 'idle' | 'succeeded' | 'failed' | 'loading';
  error: string | null;
  name: string;
}

export const initialState: TOrderBurgerState = {
  order: null,
  requestStatus: 'idle',
  error: null,
  name: ''
};

export const placeOrder = createAsyncThunk(
  'orderBurger/placeOrder',
  async (data: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(data);
      return { order: response.order, name: response.name };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderBurgerSlice = createSlice({
  name: 'orderBurger',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.requestStatus = 'idle';
      state.error = null;
      state.name = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.requestStatus = 'loading';
        state.error = null;
      })
      .addCase(
        placeOrder.fulfilled,
        (state, action: PayloadAction<{ order: TOrder; name: string }>) => {
          state.order = action.payload.order;
          state.name = action.payload.name;
          state.requestStatus = 'succeeded';
        }
      )
      .addCase(placeOrder.rejected, (state, action) => {
        state.requestStatus = 'failed';
        state.error = action.error.message || 'Failed to place order';
      });
  }
});

export const { resetOrder } = orderBurgerSlice.actions;

export const selectOrderBurger = (state: RootState) => state.orderBurger.order;
export const selectOrderBurgerStatus = (state: RootState) =>
  state.orderBurger.requestStatus;
export const selectOrderBurgerError = (state: RootState) =>
  state.orderBurger.error;
export const selectOrderBurgerName = (state: RootState) =>
  state.orderBurger.name;

export default orderBurgerSlice.reducer;
