import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../src/services/rootReducer";

describe('rootReducer', () => {
  it('должны отображаться корректные данные дефолтного состояния', () => {
    const store = configureStore ({reducer: rootReducer});
    const initialState = store.getState();

    expect(initialState).toEqual({
      ingredients: {
        items: [],
        status: 'idle',
        error: null,
      },
      orders: {
        orders: [],
        order: null,
        status: 'idle',
        error: null,
      },
      user: {
        user: {
          email:'',
          name:''
        },
        isAuth: false,
        status: 'idle',
        error: null,
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        requestStatus: 'idle',
        error: null,
      },
      orderBurger: {
        order: null,
        name: '',
        requestStatus: 'idle',
        error: null,
      },
      burger: {
        constructorItems: {
          bun: null,
          ingredients: []
        },
        orderModalData: null,
        orderRequest: false,
        loading: false,
        error: null
      }
    });
  });
});
