import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@shared/types/user';
import type { AuthState } from '../types/state.types';

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuthState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setAuthenticated,
  setToken,
  setUser,
  setLoading,
  setError,
  clearAuthState,
} = authSlice.actions;

export default authSlice.reducer;
