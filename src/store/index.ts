import { configureStore, combineReducers, AnyAction, Reducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import { adminViewReducer } from './slices/adminView.slice';
import technicianReducer from './slices/technicianSlice';
import bookingReducer from './slices/bookingSlice';

// Action type for resetting the entire store
export const RESET_STORE = 'RESET_STORE';

// Define the initial state with proper typing
export const initialState = {
  user: {
    currentUser: null,
    loading: false,
    error: null,
    paymentStatus: 'idle',
    verificationId: null,
    phone: null,
  },
  auth: {
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
  },
  admin: {
    isAdmin: false,
    adminData: null,
    loading: false,
    error: null,
  },
  adminView: {
    currentView: 'regular',
  },
  technician: {
    currentTechnician: null,
    technicians: [],
    schedules: [],
    loading: false,
    error: null,
  },
  booking: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null,
    filters: {}
  }
};

// Define the app state type
export interface AppState {
  user: ReturnType<typeof userReducer>;
  auth: ReturnType<typeof authReducer>;
  admin: ReturnType<typeof adminReducer>;
  adminView: ReturnType<typeof adminViewReducer>;
  technician: ReturnType<typeof technicianReducer>;
  booking: ReturnType<typeof bookingReducer>;
}

// Create individual reducers
const reducers = {
  user: userReducer,
  auth: authReducer,
  admin: adminReducer,
  adminView: adminViewReducer,
  technician: technicianReducer,
  booking: bookingReducer,
};

// Root reducer that handles store reset
const rootReducer = (state: AppState | undefined, action: AnyAction): AppState => {
  if (action.type === RESET_STORE) {
    return initialState as AppState;
  }
  return combineReducers(reducers)(state as any, action);
};

// Configure store with middleware
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
