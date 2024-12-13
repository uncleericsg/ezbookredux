import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state
export const initialState = {
  isAdmin: false,
  adminData: null as any,
  loading: false,
  error: null as string | null,
};

export type AdminState = typeof initialState;

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setAdminData: (state, action: PayloadAction<any>) => {
      state.adminData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAdmin: (state) => {
      // Reset to initial state
      return initialState;
    },
  },
});

export const { setAdmin, setAdminData, setLoading, setError, resetAdmin } = adminSlice.actions;

export default adminSlice.reducer;
