import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { authenticateUser } from '../../services/auth';

// Define the initial state
export const initialState = {
  currentUser: null as User | null,
  loading: false,
  error: null as string | null,
  paymentStatus: 'idle' as 'idle' | 'processing' | 'success' | 'error',
};

export type UserState = typeof initialState;

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const result = await authenticateUser(email, password);
      if (result.success) {
        return result.user;
      } else {
        return rejectWithValue(result.error || 'Authentication failed');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred during login');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearUser: (state) => {
      // Reset to initial state completely
      return initialState;
    },
    setPaymentStatus: (state, action: PayloadAction<UserState['paymentStatus']>) => {
      state.paymentStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  setLoading,
  setError,
  updateUserProfile,
  clearUser,
  setPaymentStatus
} = userSlice.actions;

export { login as loginAction };
export default userSlice.reducer;
