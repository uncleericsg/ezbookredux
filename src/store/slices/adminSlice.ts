import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AdminData {
  totalUsers?: number;
  activeBookings?: number;
  pendingBookings?: number;
  completedBookings?: number;
  recentActivities?: Array<{
    id: string;
    type: string;
    userId: string;
    timestamp: string;
  }>;
}

interface AdminState {
  isAdmin: boolean;
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isAdmin: false,
  adminData: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
      if (!action.payload) {
        state.adminData = null;
      }
    },
    setAdminData: (state, action: PayloadAction<AdminData | null>) => {
      state.adminData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetAdmin: (state) => {
      state.isAdmin = false;
      state.adminData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { 
  setIsAdmin, 
  setAdminData,
  setLoading,
  setError,
  resetAdmin
} = adminSlice.actions;

export default adminSlice.reducer;
