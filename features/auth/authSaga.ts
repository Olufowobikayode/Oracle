
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  checkAuth,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  authCheckFinished,
} from './authSlice';
import type { PayloadAction } from '@reduxjs/toolkit';

const AUTH_KEY = 'goddess_saga_auth';

function* handleLogin(action: PayloadAction<{ email: string; password: string }>): Generator {
  try {
    const { email, password } = action.payload;

    // --- MOCKED AUTHENTICATION ---
    // In a real app, this would be an API call.
    // We are hardcoding credentials for this demo.
    if (email === 'admin@example.com' && password === 'password') {
      const user = { email };
      yield call([localStorage, 'setItem'], AUTH_KEY, JSON.stringify(user));
      yield put(loginSuccess(user));
    } else {
      throw new Error('Invalid email or password.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    yield put(loginFailure(errorMessage));
  }
}

function* handleLogout(): Generator {
  yield call([localStorage, 'removeItem'], AUTH_KEY);
  // No need to dispatch anything, the reducer handles state clearing
}

function* handleCheckAuth(): Generator {
    try {
        const userData = yield call([localStorage, 'getItem'], AUTH_KEY);
        if (userData) {
            const user = JSON.parse(userData as string);
            yield put(loginSuccess(user));
        }
    } catch (error) {
        // If parsing fails or any other error, treat as not logged in
        yield call([localStorage, 'removeItem'], AUTH_KEY);
    } finally {
        yield put(authCheckFinished());
    }
}

function* authSaga() {
  yield takeLatest(loginStart.type, handleLogin);
  yield takeLatest(logout.type, handleLogout);
  yield takeLatest(checkAuth.type, handleCheckAuth);
}

export default authSaga;
