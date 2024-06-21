import feedReducer, {
  fetchFeedOrders,
  selectFeedOrder,
  selectFeedState,
  TFeedState
} from '../src/services/slices/feedSlice';
import { TOrder } from '../src/utils/types';
import { RootState } from '../src/services/store';

const ordersMockData: TOrder[] = [
  {
    _id: '1',
    name: 'Order 1',
    status: 'done',
    number: 1,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
    ingredients: ['ingredient1', 'ingredient2']
  },
  {
    _id: '2',
    name: 'Order 2',
    status: 'pending',
    number: 2,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-02',
    ingredients: ['ingredient3', 'ingredient4'],
  }
];

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  requestStatus: 'idle',
  error: null
};

describe('feedSlice', () => {
  it('should handle initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchFeedOrders.pending', () => {
    const action = { type: fetchFeedOrders.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.requestStatus).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle fetchFeedOrders.fulfilled', () => {
    const action = {
      type: fetchFeedOrders.fulfilled.type,
      payload: { orders: ordersMockData, total: 2, totalToday: 1 }
    };
    const state = feedReducer(initialState, action);
    expect(state.orders).toEqual(ordersMockData);
    expect(state.total).toBe(2);
    expect(state.totalToday).toBe(1);
    expect(state.requestStatus).toBe('succeeded');
  });

  it('should handle fetchFeedOrders.rejected', () => {
    const action = {
      type: fetchFeedOrders.rejected.type,
      error: { message: 'Fetch failed' }
    };
    const state = feedReducer(initialState, action);
    expect(state.requestStatus).toBe('failed');
    expect(state.error).toBe('Fetch failed');
  });

  it('selectFeedOrder should return orders', () => {
    const rootState = { feed: { ...initialState, orders: ordersMockData } };
    expect(selectFeedOrder(rootState as RootState)).toEqual(ordersMockData);
  });

  it('selectFeedState should return feed state', () => {
    const rootState = { feed: initialState };
    expect(selectFeedState(rootState as RootState)).toEqual(initialState);
  });
});
