import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { 
  User, 
  UserState, 
  OTPVerificationPayload,
  OTPVerificationResponse,
  OTPRequestResponse
} from '../../types/user';
import { sendOTP, verifyOTP } from '../../services/auth';

interface OTPResponse {
  verificationId: string;
  phone: string;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  verificationId: undefined,
  phone: undefined
};

// Async thunks
export const requestOTP = createAsyncThunk<
  OTPResponse,
  string,
  { rejectValue: string }
>(
  'user/requestOTP',
  async (phoneNumber, { rejectWithValue }) => {
    try {
      const result = await sendOTP(phoneNumber);
      return {
        verificationId: result.verificationId,
        phone: phoneNumber
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to send OTP');
    }
  }
);

export const verifyUserOTP = createAsyncThunk<
  User,
  OTPVerificationPayload,
  { rejectValue: string }
>(
  'user/verifyOTP',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await verifyOTP(payload);
      if (!result.success || !result.user) {
        return rejectWithValue(result.error || 'Failed to verify OTP');
      }
      return result.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to verify OTP');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
      }
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.verificationId = undefined;
      state.phone = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      // Request OTP
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
        state.error = action.payload || 'Failed to send OTP';
      })
      // Verify OTP
      .addCase(verifyUserOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.verificationId = undefined;
        state.phone = undefined;
      })
      .addCase(verifyUserOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to verify OTP';
      });
  }
});

export const {
  setUser,
  setLoading,
  setError,
  updateUserProfile,
  clearUser
} = userSlice.actions;

export default userSlice.reducer;
