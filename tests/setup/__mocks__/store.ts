import { configureStore } from '@reduxjs/toolkit'
import type { PreloadedState } from '@reduxjs/toolkit'
import type { RootState } from '@store/types'

// Basic mock reducer that returns whatever state it receives
const mockReducer = (state = {}) => state

export function createMockStore(preloadedState: Partial<PreloadedState<RootState>> = {}) {
  return configureStore({
    reducer: {
      admin: mockReducer,
      auth: mockReducer,
      booking: mockReducer,
      service: mockReducer,
      technician: mockReducer,
      user: mockReducer,
      ui: mockReducer,
      payment: mockReducer,
      notification: mockReducer
    },
    preloadedState: preloadedState as PreloadedState<RootState>,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false
      })
  })
}

// Export store type
export type MockStore = ReturnType<typeof createMockStore>

// Export test utils
export const mockDispatch = jest.fn()
export const mockSelector = jest.fn()

// Create a basic pre-configured test store
export const createTestStore = (initialState = {}) => {
  const store = createMockStore(initialState)
  return {
    store,
    mockDispatch: store.dispatch as jest.Mock,
    mockSelector: jest.fn()
  }
}