import { configureStore, combineReducers, AnyAction, Reducer } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import reducers
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import technicianReducer from './slices/technicianSlice';
import { mockAuthState, mockUserState, mockAdminState, mockTechnicianState } from '../mocks/data';

// Action type for resetting the entire store
export const RESET_STORE = 'RESET_STORE';

// Define the initial state with proper typing
const initialState = {
  user: {
    currentUser: null,
    loading: false,
    error: null,
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
  technician: {
    // Add initial state for technician
  },
} as const;

// Define the app state type
export interface AppState {
  user: ReturnType<typeof userReducer>;
  auth: ReturnType<typeof authReducer>;
  admin: ReturnType<typeof adminReducer>;
  technician: ReturnType<typeof technicianReducer>;
}

// Create individual reducers
const reducers = {
  user: userReducer,
  auth: authReducer,
  admin: adminReducer,
  technician: technicianReducer,
};

// Create combined reducer
const appReducer = combineReducers(reducers);

// Root reducer that handles store reset
const rootReducer: Reducer = (state: AppState | undefined, action: AnyAction): AppState => {
  if (action.type === RESET_STORE) {
    // Return a fresh copy of initial state
    return JSON.parse(JSON.stringify(initialState));
  }

  // Pass the state to the combined reducer
  return appReducer(state, action);
};

// Configure store with middleware
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    auth: mockAuthState,
    user: mockUserState,
    admin: mockAdminState,
    technician: mockTechnicianState,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [RESET_STORE],
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: ['user.currentUser.createdAt', 'user.currentUser.updatedAt'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types and hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
