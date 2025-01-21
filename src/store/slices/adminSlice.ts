import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@shared/types/user';
import type { AdminState } from '../types/state.types';

const initialState: AdminState = {
  adminData: {
    settings: {},
    stats: {},
  },
  currentUser: null,
  isAdmin: false,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdminData: (state, action: PayloadAction<AdminState['adminData']>) => {
      state.adminData = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAdminState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setAdminData,
  setCurrentUser,
  setIsAdmin,
  setLoading,
  setError,
  clearAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
