import { combineReducers } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import serviceReducer from './slices/serviceSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  admin: adminReducer,
  auth: authReducer,
  booking: bookingReducer,
  service: serviceReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
