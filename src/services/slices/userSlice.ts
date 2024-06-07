import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getUserApi,
  registerUserApi,
  updateUserApi,
  loginUserApi,
  logoutApi
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { TLoginData } from '@api';
import { RootState } from '../store';

type TUserState = {
  isAuth: boolean;
  user: TUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: TUserState = {
  isAuth: false,
  user: null,
  status: 'idle',
  error: null
};

export const getUser = createAsyncThunk('user/getUser', getUserApi);
export const register = createAsyncThunk('user/register', registerUserApi);
export const updateUser = createAsyncThunk('user/update', updateUserApi);
export const login = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => {
    const data = await loginUserApi(userData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);
export const logout = createAsyncThunk('user/logout', async () => {
  const data = await logoutApi();
  if (data.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authCheck: (state) => {
      state.isAuth = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration error';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
        state.status = 'succeeded';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login error';
      })
      .addCase(logout.fulfilled, () => initialState)

      .addCase(getUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Get user error';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.status = 'succeeded';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Update user error';
      });
  }
});

export default userSlice.reducer;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuth = (state: RootState) => state.user.isAuth;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
