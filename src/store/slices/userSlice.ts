import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@shared/types/user';
import type { PaymentStatus } from '@shared/types/payment';
import type { UserState } from '../types/state.types';

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  paymentStatus: null,
  verificationId: null,
  phone: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus | null>) => {
      state.paymentStatus = action.payload;
    },
    setVerificationId: (state, action: PayloadAction<string | null>) => {
      state.verificationId = action.payload;
    },
    setPhone: (state, action: PayloadAction<string | null>) => {
      state.phone = action.payload;
    },
    clearUserState: (state) => {
      Object.assign(state, initialState);
    }
  }
});

export const {
  setUser,
  setLoading,
  setError,
  setPaymentStatus,
  setVerificationId,
  setPhone,
  clearUserState
} = userSlice.actions;

export default userSlice.reducer;
