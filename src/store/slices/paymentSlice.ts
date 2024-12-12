import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  paymentMethod: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  error: string | null;
  transactionHistory: any[];
}

const initialState: PaymentState = {
  paymentMethod: null,
  paymentStatus: 'idle',
  error: null,
  transactionHistory: [],
};

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<string | null>) => {
      state.paymentMethod = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentState['paymentStatus']>) => {
      state.paymentStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.paymentStatus = 'error';
    },
    addTransaction: (state, action: PayloadAction<any>) => {
      state.transactionHistory.push(action.payload);
    },
    clearPaymentState: (state) => {
      state.paymentMethod = null;
      state.paymentStatus = 'idle';
      state.error = null;
    },
  },
});

export const {
  setPaymentMethod,
  setPaymentStatus,
  setError,
  addTransaction,
  clearPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
