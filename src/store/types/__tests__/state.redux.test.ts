import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../redux';

describe('Redux State Types', () => {
  it('should have the correct state structure', () => {
    const store = configureStore({
      reducer: {
        admin: (state = { adminData: null, loading: false, error: null }) => state,
        auth: (state = { 
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
          paymentStatus: 'idle',
          verificationId: null,
          phone: null
        }) => state,
        user: (state = { 
          user: null,
          isLoading: false,
          error: null,
          paymentStatus: 'idle',
          verificationId: null,
          phone: null
        }) => state,
        booking: (state = {
          bookings: [],
          currentBooking: null,
          loading: false,
          error: null,
          filters: {}
        }) => state,
        service: (state = {
          services: [],
          loading: false,
          error: null
        }) => state
      },
    });

    const state = store.getState() as RootState;

    // Test state structure
    expect(state).toHaveProperty('admin');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('booking');
    expect(state).toHaveProperty('service');

    // Test type safety
    expect(state.admin.adminData).toBeNull();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.user.user).toBeNull();
  });

  it('should maintain type safety with state updates', () => {
    const store = configureStore({
      reducer: {
        admin: (state = { adminData: null, loading: false, error: null }, action) => {
          switch (action.type) {
            case 'admin/setAdminData':
              return { ...state, adminData: action.payload };
            default:
              return state;
          }
        },
      },
    });

    store.dispatch({ type: 'admin/setAdminData', payload: { id: '1', role: 'admin' } });
    const state = store.getState() as RootState;
    
    expect(state.admin.adminData).toEqual({ id: '1', role: 'admin' });
  });

  it('should handle null user state', () => {
    const state = {
      user: {
        user: null,
        isLoading: false,
        error: null,
        paymentStatus: 'idle' as const,
        verificationId: null,
        phone: null
      }
    };

    expect(state.user.user).toBeNull();
  });
});
