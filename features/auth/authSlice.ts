
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true, // Start with loading true for initial auth check
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    checkAuth(state) {
      state.loading = true;
    },
    loginStart(state, action: PayloadAction<{ email: string; password: string }>) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ email: string }>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    authCheckFinished(state) {
      state.loading = false;
    }
  },
});

export const {
  checkAuth,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  authCheckFinished,
} = authSlice.actions;

export default authSlice.reducer;
