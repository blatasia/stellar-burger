import orderBurgerReducer, {
  placeOrder,
  resetOrder,
  selectOrderBurger,
  selectOrderBurgerStatus,
  selectOrderBurgerError,
  selectOrderBurgerName,
  initialState
} from '../orderBurgerSlice';
import { TOrder } from '../../../utils/types';
import { RootState } from '../../store';

const orderMockData: TOrder = {
  _id: '1',
  status: 'done',
  number: 12345,
  name: 'Test Order',
  createdAt: '2021-01-01T00:00:00.000Z',
  updatedAt: '2021-01-01T00:00:00.000Z',
  ingredients: ['ingredient1', 'ingredient2']
};

const responseMock = {
  order: orderMockData,
  name: 'Test Order Name'
};

describe('orderBurgerSlice', () => {
  it('should handle initial state', () => {
    expect(orderBurgerReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  it('should handle placeOrder.pending', () => {
    const action = { type: placeOrder.pending.type };
    const state = orderBurgerReducer(initialState, action);
    expect(state.requestStatus).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle placeOrder.fulfilled', () => {
    const action = {
      type: placeOrder.fulfilled.type,
      payload: responseMock
    };
    const state = orderBurgerReducer(initialState, action);
    expect(state.requestStatus).toBe('succeeded');
    expect(state.order).toEqual(orderMockData);
    expect(state.name).toEqual('Test Order Name');
  });

  it('should handle placeOrder.rejected', () => {
    const action = {
      type: placeOrder.rejected.type,
      error: { message: 'Failed to place order' }
    };
    const state = orderBurgerReducer(initialState, action);
    expect(state.requestStatus).toBe('failed');
    expect(state.error).toBe('Failed to place order');
  });

  it('should handle resetOrder', () => {
    const action = { type: resetOrder.type };
    const state = orderBurgerReducer(
      {
        order: orderMockData,
        requestStatus: 'succeeded',
        error: 'Some error',
        name: 'Test Order Name'
      },
      action
    );
    expect(state).toEqual(initialState);
  });

  it('selectOrderBurger should return order', () => {
    const rootState = {
      orderBurger: { ...initialState, order: orderMockData }
    };
    expect(selectOrderBurger(rootState as RootState)).toEqual(orderMockData);
  });

  it('selectOrderBurgerStatus should return status', () => {
    const rootState = { orderBurger: initialState };
    expect(selectOrderBurgerStatus(rootState as RootState)).toEqual(
      initialState.requestStatus
    );
  });

  it('selectOrderBurgerError should return error', () => {
    const rootState = { orderBurger: { ...initialState, error: 'Some error' } };
    expect(selectOrderBurgerError(rootState as RootState)).toEqual(
      'Some error'
    );
  });

  it('selectOrderBurgerName should return name', () => {
    const rootState = {
      orderBurger: { ...initialState, name: 'Test Order Name' }
    };
    expect(selectOrderBurgerName(rootState as RootState)).toEqual(
      'Test Order Name'
    );
  });
});
