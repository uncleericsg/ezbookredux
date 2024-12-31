import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import authReducer from './slices/authSlice';

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
