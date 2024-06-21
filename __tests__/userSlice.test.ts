import {
  initialState,
  register,
  login,
  logout,
  getUser,
  updateUser
} from '../src/services/slices/userSlice';
import userReducer from '../src/services/slices/userSlice';
import { TUser } from '../src/utils/types';
import { Action } from '@reduxjs/toolkit';

describe('User slice', () => {
  const mockUser: TUser = {
    name: 'testaccount@test.ru',
    email: 'testaccount@test.ru'
  };

  test('should handle initial state', () => {
    expect(userReducer(undefined, {} as Action)).toEqual(initialState);
  });

  test('should handle register.pending', () => {
    const action = { type: register.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle register.fulfilled', () => {
    const action = { type: register.fulfilled.type, payload: { user: mockUser } };
    const state = userReducer(initialState, action);
    expect(state.isAuth).toBe(true);
    expect(state.user).toMatchObject(mockUser);
    expect(state.status).toBe('succeeded');
  });

  test('should handle register.rejected', () => {
    const action = { type: register.rejected.type, error: { message: 'Ошибка регистрации' } };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка регистрации');
  });

  test('should handle login.pending', () => {
    const action = { type: login.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle login.fulfilled', () => {
    const action = { type: login.fulfilled.type, payload: mockUser };
    const state = userReducer(initialState, action);
    expect(state.isAuth).toBe(true);
    expect(state.user).toMatchObject(mockUser);
  });

  test('should handle login.rejected', () => {
    const action = { type: login.rejected.type, error: { message: 'Ошибка авторизации' } };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка авторизации');
  });


  test('should handle logout.fulfilled', () => {
    const initialStateWithUser = {
      ...initialState,
      isAuth: true,
      user: mockUser,
    };
    const action = { type: logout.fulfilled.type };
    const state = userReducer(initialStateWithUser, action);
    expect(state.isAuth).toBe(false);
    expect(state.user).toEqual(initialState.user);
  });

  test('should handle getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle getUser.fulfilled', () => {
    const action = { type: getUser.fulfilled.type, payload: { user: mockUser } };
    const state = userReducer(initialState, action);
    expect(state.isAuth).toBe(true);
    expect(state.user).toMatchObject(mockUser);
  });

  test('should handle getUser.rejected', () => {
    const action = { type: getUser.rejected.type, error: { message: 'Ошибка получения пользователя' } };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка получения пользователя');
  });

  test('should handle updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('should handle updateUser.fulfilled', () => {
    const initialStateWithUser = {
      ...initialState,
      isAuth: true,
      user: mockUser,
    };
    const action = { type: updateUser.fulfilled.type, payload: { user: mockUser } };
    const state = userReducer(initialStateWithUser, action);
    expect(state.isAuth).toBe(true);
    expect(state.user).toMatchObject(mockUser);
    expect(state.status).toBe('succeeded');
  });

  test('should handle updateUser.rejected', () => {
    const action = { type: updateUser.rejected.type, error: { message: 'Ошибка обновления пользователя' } };
    const state = userReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Ошибка обновления пользователя');
  });
});
