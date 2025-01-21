import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  User,
  UserState,
  AuthState
} from '../../types/user';
import { authenticate, signOut } from '../../services/auth';

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  verificationId: undefined,
  phone: undefined
};

export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authenticate();
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const signOutUser = createAsyncThunk(
  'user/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await signOut();
      return null;
    } catch (error) {
      return rejectWithValue(error);
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
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.verificationId = undefined;
      state.phone = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Authentication failed';
        state.currentUser = null;
      })
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.loading = false;
        state.error = null;
        state.verificationId = undefined;
        state.phone = undefined;
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign out failed';
      });
  }
});

export const {
  setUser,
  setLoading,
  setError,
  clearError,
  resetState
} = userSlice.actions;

export default userSlice.reducer;
