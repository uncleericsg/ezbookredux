import React from 'react';
import { vi } from 'vitest';

export const mockStore = {
  useAppDispatch: () => vi.fn(),
  useAppSelector: vi.fn().mockImplementation(selector => selector({
    auth: {
      isAuthenticated: false,
      loading: false,
      token: null
    },
    user: {
      user: null,
      error: null
    }
  })),
  userSlice: {
    actions: {
      setUser: vi.fn(),
      setError: vi.fn()
    },
    reducer: vi.fn()
  },
  authSlice: {
    actions: {
      setAuthenticated: vi.fn(),
      setToken: vi.fn()
    },
    reducer: vi.fn()
  },
  slices: {
    userSlice: {
      actions: {
        setUser: vi.fn(),
        setError: vi.fn()
      },
      reducer: vi.fn()
    },
    authSlice: {
      actions: {
        setAuthenticated: vi.fn(),
        setToken: vi.fn()
      },
      reducer: vi.fn()
    }
  }
};

// Mock individual slice imports
vi.mock('@store/slices/userSlice', () => ({
  setUser: vi.fn(),
  setError: vi.fn()
}));

vi.mock('@store/slices/authSlice', () => ({
  setAuthenticated: vi.fn(),
  setToken: vi.fn()
}));

// Mock LoadingScreen component
vi.mock('@components/LoadingScreen', () => ({
  default: () => React.createElement('div', null, 'Loading...')
}));
