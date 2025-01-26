import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/store/slices/authSlice'
import userReducer from '@/store/slices/userSlice'
import bookingReducer from '@/store/slices/bookingSlice'
import notificationReducer from '@/store/slices/notificationSlice'

export function createMockStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      booking: bookingReducer,
      notification: notificationReducer
    },
    preloadedState: {
      auth: {
        isAuthenticated: false,
        token: null,
        loading: false,
        error: null,
        ...preloadedState.auth
      },
      user: {
        currentUser: null,
        loading: false,
        error: null,
        ...preloadedState.user
      },
      booking: {
        currentBooking: null,
        bookings: [],
        loading: false,
        error: null,
        ...preloadedState.booking
      },
      notification: {
        notifications: [],
        templates: [],
        loading: false,
        error: null,
        ...preloadedState.notification
      }
    }
  })
} 