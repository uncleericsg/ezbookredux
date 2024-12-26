import { describe, it, expect } from 'vitest';
import { createTestStore } from '../../../test/redux-utils';
import type { RootState } from '../state.types';

describe('Redux State Types', () => {
  it('should match the expected state structure', () => {
    const store = createTestStore();
    const state = store.getState();

    // Test state structure
    expect(state).toHaveProperty('admin');
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('booking');
    expect(state).toHaveProperty('service');
    expect(state).toHaveProperty('technician');
    expect(state).toHaveProperty('user');

    // Test initial state values
    expect(state.admin).toEqual({
      isAdmin: false,
      adminData: null,
      loading: false,
      error: null,
    });

    expect(state.auth).toEqual({
      isAuthenticated: false,
      token: null,
      loading: false,
      error: null,
    });
  });

  it('should allow type-safe access to state', () => {
    const testUser = {
      currentUser: null,
      loading: false,
      error: null,
    };

    const store = createTestStore({
      user: testUser,
    });

    const state = store.getState() as RootState;
    
    // Type-safe access should work without type errors
    const { currentUser, loading, error } = state.user;
    
    expect(currentUser).toBeNull();
    expect(loading).toBe(false);
    expect(error).toBeNull();
  });
});
