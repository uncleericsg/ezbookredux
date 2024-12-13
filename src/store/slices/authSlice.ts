import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
export const initialState = {
  isAuthenticated: false,
  token: null as string | null,
  loading: false,
  error: null as string | null,
};

export type AuthState = typeof initialState;

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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAuth: (state) => {
      // Reset to initial state
      return initialState;
    },
  },
});

export const { setAuthenticated, setToken, setLoading, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
