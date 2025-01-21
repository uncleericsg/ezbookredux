import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['booking/setCurrentBooking'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.scheduledDateTime'],
        // Ignore these paths in the state
        ignoredPaths: ['booking.currentBooking.scheduledDateTime'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
