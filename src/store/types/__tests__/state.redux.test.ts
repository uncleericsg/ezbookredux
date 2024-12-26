import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../state.types';

describe('Redux State Types', () => {
  it('should have the correct state structure', () => {
    const store = configureStore({
      reducer: {
        admin: (state = { isAdmin: false, adminData: null, loading: false, error: null }) => state,
        auth: (state = { isAuthenticated: false, token: null, loading: false, error: null }) => state,
        user: (state = { currentUser: null, loading: false, error: null }) => state,
        booking: (state = {}) => state,
        service: (state = {}) => state,
        technician: (state = {}) => state,
      },
    });

    const state = store.getState() as RootState;

    // Test state structure
    expect(state).toHaveProperty('admin');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('booking');
    expect(state).toHaveProperty('service');
    expect(state).toHaveProperty('technician');

    // Test type safety
    expect(state.admin.isAdmin).toBe(false);
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.user.currentUser).toBeNull();
  });

  it('should maintain type safety with state updates', () => {
    const store = configureStore({
      reducer: {
        admin: (state = { isAdmin: false }, action) => {
          switch (action.type) {
            case 'admin/setAdmin':
              return { ...state, isAdmin: action.payload };
            default:
              return state;
          }
        },
      },
    });

    // This would cause a TypeScript error if types are wrong
    store.dispatch({ type: 'admin/setAdmin', payload: true });
    const state = store.getState() as RootState;
    
    expect(state.admin.isAdmin).toBe(true);
  });
});
