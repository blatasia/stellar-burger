import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export interface OrdersState {
  orders: TOrder[];
  order: TOrder | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  order: null,
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

export const fetchOrderById = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderById',
  async (orderId) => {
    const response = await getOrderByNumberApi(orderId);
    return response.orders[0];
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
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetchOrderById orders';
      });
  }
});

export default ordersSlice.reducer;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrdersStatus = (state: RootState) => state.orders.status;
export const selectOrdersError = (state: RootState) => state.orders.error;
