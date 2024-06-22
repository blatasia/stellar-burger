import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import ordersReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import orderBurgerReducer from './slices/orderBurgerSlice';
import burgerReducer from './slices/burgerSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  orders: ordersReducer,
  user: userReducer,
  feed: feedReducer,
  orderBurger: orderBurgerReducer,
  burger: burgerReducer
});

export default rootReducer;
