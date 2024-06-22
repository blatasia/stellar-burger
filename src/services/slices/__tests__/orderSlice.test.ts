import { configureStore } from '@reduxjs/toolkit';
import ordersReducer, {
  fetchOrderById,
  fetchOrders,
  OrdersState,
  selectOrders,
  selectOrdersError,
  selectOrdersStatus,
  initialState
} from '../orderSlice';
import { TOrder } from '../../../utils/types';
import { RootState } from '../../store';

const ordersMockData: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    number: 12345,
    name: 'Order 1',
    createdAt: '2021-01-01T00:00:00.000Z',
    updatedAt: '2021-01-01T00:00:00.000Z',
    ingredients: ['ingredient1', 'ingredient2']
  },
  {
    _id: '2',
    status: 'pending',
    number: 12346,
    name: 'Order 2',
    createdAt: '2021-01-02T00:00:00.000Z',
    updatedAt: '2021-01-02T00:00:00.000Z',
    ingredients: ['ingredient3', 'ingredient4']
  }
];

const orderMockData: TOrder = {
  ...ordersMockData[0]
};

describe('ordersSlice', () => {
  it('should handle initial state', () => {
    expect(ordersReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchOrders.pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('loading');
  });

  it('should handle fetchOrders.fulfilled', () => {
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: ordersMockData
    };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.orders).toEqual(ordersMockData);
  });

  it('should handle fetchOrders.rejected', () => {
    const action = {
      type: fetchOrders.rejected.type,
      error: { message: 'Failed to fetch orders' }
    };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to fetch orders');
  });

  it('should handle fetchOrderById.pending', () => {
    const action = { type: fetchOrderById.pending.type };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('loading');
  });

  it('should handle fetchOrderById.fulfilled', () => {
    const action = {
      type: fetchOrderById.fulfilled.type,
      payload: orderMockData
    };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.order).toEqual(orderMockData);
  });

  it('should handle fetchOrderById.rejected', () => {
    const action = {
      type: fetchOrderById.rejected.type,
      error: { message: 'Failed to fetchOrderById orders' }
    };
    const state = ordersReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to fetchOrderById orders');
  });

  it('selectOrders should return orders', () => {
    const rootState = { orders: { ...initialState, orders: ordersMockData } };
    expect(selectOrders(rootState as RootState)).toEqual(ordersMockData);
  });

  it('selectOrdersStatus should return status', () => {
    const rootState = { orders: initialState };
    expect(selectOrdersStatus(rootState as RootState)).toEqual(
      initialState.status
    );
  });

  it('selectOrdersError should return error', () => {
    const rootState = { orders: { ...initialState, error: 'Some error' } };
    expect(selectOrdersError(rootState as RootState)).toEqual('Some error');
  });
});
