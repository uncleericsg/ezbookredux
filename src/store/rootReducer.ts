import { combineReducers } from '@reduxjs/toolkit';

import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import serviceReducer from './slices/serviceSlice';
import technicianReducer from './slices/technicianSlice';
import userReducer from './slices/userSlice';

const appReducer = combineReducers({
  admin: adminReducer,
  auth: authReducer,
  booking: bookingReducer,
  service: serviceReducer,
  technician: technicianReducer,
  user: userReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const RESET_STORE = 'RESET_STORE';
export const resetStore = () => ({ type: RESET_STORE });

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
