import React, { createContext, useContext, useReducer } from 'react';
import { PaymentDetails, TransactionRecord } from '../types/payment';

interface ServiceDetails {
  type: string;
  date: string;
  time: string;
  duration: number;
}

interface CustomerInfo {
  email: string;
  name?: string;
  phone?: string;
}

interface PaymentState {
  amount: number;
  totalAmount: number;
  currency: string;
  termsAccepted: boolean;
  error: string | null;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  transactions: TransactionRecord[];
  serviceDetails: ServiceDetails;
  customerInfo: CustomerInfo | null;
}

type PaymentAction =
  | { type: 'SET_AMOUNT'; payload: number }
  | { type: 'SET_CURRENCY'; payload: string }
  | { type: 'SET_TERMS_ACCEPTED'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PAYMENT_STATUS'; payload: 'idle' | 'processing' | 'success' | 'failed' }
  | { type: 'ADD_TRANSACTION'; payload: TransactionRecord }
  | { type: 'SET_SERVICE_DETAILS'; payload: ServiceDetails }
  | { type: 'SET_CUSTOMER_INFO'; payload: CustomerInfo | null }
  | { type: 'RESET_STATE' };

const initialState: PaymentState = {
  amount: 0,
  totalAmount: 0,
  currency: 'sgd',
  termsAccepted: false,
  error: null,
  paymentStatus: 'idle',
  transactions: [],
  serviceDetails: {
    type: '',
    date: '',
    time: '',
    duration: 0,
  },
  customerInfo: null,
};

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'SET_AMOUNT':
      return {
        ...state,
        amount: action.payload,
        totalAmount: action.payload,
      };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_TERMS_ACCEPTED':
      console.log('Setting terms accepted to:', action.payload); // Debug log
      return { ...state, termsAccepted: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PAYMENT_STATUS':
      return { ...state, paymentStatus: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      };
    case 'SET_SERVICE_DETAILS':
      return { ...state, serviceDetails: action.payload };
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

const PaymentContext = createContext<{
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
} | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  return (
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentProvider;
