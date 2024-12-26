import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserViewType = 'non-user' | 'regular' | 'amc' | 'admin';

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
  currentView: UserViewType;
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  isAdmin: false,
  currentView: 'regular',
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
        state.currentView = 'regular';
      }
    },
    setCurrentView: (state, action: PayloadAction<UserViewType>) => {
      state.currentView = action.payload;
    },
    resetView: (state) => {
      state.currentView = 'regular';
    },
    setAdminData: (state, action: PayloadAction<AdminData | null>) => {
      state.adminData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetAdmin: (_state) => initialState,
  },
});

export const { 
  setIsAdmin, 
  setCurrentView,
  resetView,
  setAdminData, 
  setLoading, 
  setError, 
  resetAdmin 
} = adminSlice.actions;

export default adminSlice.reducer;
