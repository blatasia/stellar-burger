import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

interface OrdersState {
  orders: TOrder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  status: 'idle',
  error: null
};

export const fetchOrders = createAsyncThunk<TOrder[]>(
  'orders/fetchOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;
