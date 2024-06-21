import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

export interface TFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  requestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  requestStatus: 'idle',
  error: null
};

export const fetchFeedOrders = createAsyncThunk(
  'feed/fetchOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.requestStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.requestStatus = 'succeeded';
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.requestStatus = 'failed';
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export default feedSlice.reducer;

export const selectFeedOrder = (state: RootState) => state.feed.orders;
export const selectFeedState = (state: RootState) => state.feed;
