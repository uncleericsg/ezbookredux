import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  paymentMethod: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  error: string | null;
  transactionHistory: TransactionRecord[];
}

interface TransactionRecord {
  id: string;
  timestamp: string;
  updatedAt: string;
  status: string;
  // Add other transaction record properties as needed
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
    // Enhanced transaction history actions
    addTransaction: (state, action: PayloadAction<TransactionRecord>) => {
      const transaction = {
        ...action.payload,
        timestamp: new Date().toISOString(),
        id: `tr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      state.transactionHistory.push(transaction);
      
      // Maintain a fixed size for transaction history
      if (state.transactionHistory.length > 100) {
        state.transactionHistory = state.transactionHistory.slice(-100);
      }
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const transaction = state.transactionHistory.find(t => t.id === action.payload.id);
      if (transaction) {
        transaction.status = action.payload.status;
        transaction.updatedAt = new Date().toISOString();
      }
    },
    clearTransactionHistory: (state) => {
      state.transactionHistory = [];
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
  updateTransactionStatus,
  clearTransactionHistory,
  clearPaymentState,
} = paymentSlice.actions;

export default paymentSlice.reducer;
