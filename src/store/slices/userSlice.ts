import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from '../../types/user';
import { sendOTP, verifyOTP } from '../../services/auth';
import { setAuthenticated, setToken } from './authSlice';

// Define the initial state
export const initialState = {
  currentUser: null as User | null,
  loading: false,
  error: null as string | null,
  paymentStatus: 'idle' as 'idle' | 'processing' | 'success' | 'error',
  verificationId: null as string | null,
  phone: null as string | null,
};

export type UserState = typeof initialState;

export const requestOTP = createAsyncThunk(
  'user/requestOTP',
  async (phone: string, { rejectWithValue }) => {
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        return { verificationId: result.verificationId, phone };
      } else {
        return rejectWithValue('Failed to send OTP');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  }
);

export const verifyUserOTP = createAsyncThunk(
  'user/verifyOTP',
  async ({ code, verificationId, phone }: { code: string; verificationId: string; phone: string }, { dispatch, rejectWithValue }) => {
    try {
      const result = await verifyOTP(verificationId, code, phone);
      if (result.success && result.user) {
        // Set auth state first
        dispatch(setAuthenticated(true));
        // Generate a mock token for now
        const mockToken = 'mock-token-' + Date.now();
        dispatch(setToken(mockToken));
        // Store auth data in localStorage
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_data', JSON.stringify(result.user));
        return result.user;
      } else {
        return rejectWithValue('Invalid OTP');
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Invalid OTP');
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
      state.error = null; // Clear any existing errors
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null; // Clear errors when starting a new operation
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },
    setPaymentStatus: (state, action: PayloadAction<UserState['paymentStatus']>) => {
      state.paymentStatus = action.payload;
      if (action.payload === 'success') {
        state.error = null; // Clear errors on successful payment
      }
    },
    clearUserState: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.paymentStatus = 'idle';
      state.verificationId = null;
      state.phone = null;
    },
    resetUser: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Request OTP cases
      .addCase(requestOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.verificationId = action.payload.verificationId;
        state.phone = action.payload.phone;
      })
      .addCase(requestOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Verify OTP cases
      .addCase(verifyUserOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload) {
          state.currentUser = action.payload;
        }
      })
      .addCase(verifyUserOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'OTP verification failed';
      });
  },
});

export const {
  setUser,
  setLoading,
  setError,
  updateUserProfile,
  setPaymentStatus,
  clearUserState,
  resetUser
} = userSlice.actions;

export default userSlice.reducer;
