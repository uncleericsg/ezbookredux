import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Payment status type
export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

// Define the initial state
export const initialState = {
  paymentData: null as any,
  loading: false,
  error: null as string | null,
  currentTransaction: null as any,
  termsAccepted: false,
  amount: 0,
  status: 'idle' as PaymentStatus,
  discount: {
    code: '',
    amount: 0
  },
  serviceDetails: null as any,
  customerName: '',
  customerEmail: '',
  serviceId: '',
  customerId: '',
  bookingId: '',
  scheduledDate: '',
  serviceName: ''
};

export type PaymentState = typeof initialState;

interface DiscountPayload {
  code: string;
  amount: number;
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action: PayloadAction<any>) => {
      state.paymentData = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentTransaction: (state, action: PayloadAction<any>) => {
      state.currentTransaction = action.payload;
    },
    setTermsAccepted: (state, action: PayloadAction<boolean>) => {
      state.termsAccepted = action.payload;
    },
    setAmount: (state, action: PayloadAction<number>) => {
      state.amount = action.payload;
    },
    applyDiscount: (state, action: PayloadAction<DiscountPayload>) => {
      state.discount = action.payload;
    },
    setServiceDetails: (state, action: PayloadAction<any>) => {
      state.serviceDetails = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload;
    },
    resetPayment: (state) => {
      // Reset to initial state
      return initialState;
    },
  },
});

export const { 
  setPaymentData, 
  setLoading, 
  setError, 
  setCurrentTransaction, 
  setTermsAccepted,
  setAmount,
  applyDiscount,
  setServiceDetails,
  setPaymentStatus,
  resetPayment 
} = paymentSlice.actions;

// Alias for resetPayment for backward compatibility
export const clearPaymentState = resetPayment;

export default paymentSlice.reducer;
