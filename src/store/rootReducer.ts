import { combineReducers } from '@reduxjs/toolkit';
import type { RootState } from './types';
import { adminReducer } from './slices/adminSlice';
import { authReducer } from './slices/authSlice';
import { bookingReducer } from './slices/bookingSlice';
import { serviceReducer } from './slices/serviceSlice';
import { userReducer } from './slices/userSlice';

const appReducer = combineReducers<RootState>({
  admin: adminReducer,
  auth: authReducer,
  booking: bookingReducer,
  service: serviceReducer,
  user: userReducer
});

export const rootReducer = (state: RootState | undefined, action: any): RootState => {
  // Handle logout by clearing the state
  if (action.type === 'auth/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export type { RootState };
