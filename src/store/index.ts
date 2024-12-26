import { configureStore, combineReducers } from '@reduxjs/toolkit';
import type { AnyAction, Reducer } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook, PreloadedState } from 'react-redux';

// Import reducers
import userReducer from '@store/slices/userSlice';
import authReducer from '@store/slices/authSlice';
import adminReducer from '@store/slices/adminSlice';
import technicianReducer from '@store/slices/technicianSlice';
import bookingReducer from '@store/slices/bookingSlice';

// Action type for resetting the entire store
const RESET_STORE = 'RESET_STORE';

// Define the initial state with proper typing
const initialState = {
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
    currentView: 'regular',
    adminData: null,
    loading: false,
    error: null,
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
interface AppState {
  user: ReturnType<typeof userReducer>;
  auth: ReturnType<typeof authReducer>;
  admin: ReturnType<typeof adminReducer>;
  technician: ReturnType<typeof technicianReducer>;
  booking: ReturnType<typeof bookingReducer>;
}

// Create individual reducers
const reducers = {
  user: userReducer,
  auth: authReducer,
  admin: adminReducer,
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
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: initialState as PreloadedState<AppState>
});

// Type declarations
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// Hook declarations
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export types
export type { AppState, RootState, AppDispatch };

// Export values
export { 
  RESET_STORE, 
  initialState, 
  store, 
  useAppDispatch, 
  useAppSelector 
};
