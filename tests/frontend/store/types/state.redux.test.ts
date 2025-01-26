import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect } from 'vitest'

import type { RootState } from '../../../../src/store/types/state.types'

describe('Redux State Types', () => {
  it('should have the correct state structure', () => {
    const store = configureStore({
      reducer: {
        admin: (state = {
          loading: false,
          error: null,
          data: null
        }) => state,
        auth: (state = {
          loading: false,
          error: null,
          token: null,
          user: null
        }) => state,
        booking: (state = {
          bookings: [],
          loading: false,
          error: null
        }) => state,
        service: (state = {
          services: [],
          loading: false,
          error: null
        }) => state,
        technician: (state = {
          currentTechnician: null,
          technicians: [],
          schedules: [],
          loading: false,
          error: null
        }) => state,
        user: (state = {
          profile: null,
          loading: false,
          error: null
        }) => state
      }
    })

    const state = store.getState() as RootState

    // Test state structure
    expect(state).toHaveProperty('admin')
    expect(state).toHaveProperty('auth')
    expect(state).toHaveProperty('user')
    expect(state).toHaveProperty('booking')
    expect(state).toHaveProperty('service')
    expect(state).toHaveProperty('technician')

    // Test type safety
    expect(state.admin.loading).toBe(false)
    expect(state.auth.token).toBeNull()
    expect(state.user.profile).toBeNull()
    expect(state.booking.bookings).toEqual([])
    expect(state.service.services).toEqual([])
    expect(state.technician.technicians).toEqual([])
  })

  it('should maintain type safety with state updates', () => {
    type AdminState = {
      loading: boolean
      error: string | null
      data: unknown | null
    }

    const adminReducer = (
      state: AdminState = {
        loading: false,
        error: null,
        data: null
      },
      action: { type: string; payload?: unknown }
    ): AdminState => {
      switch (action.type) {
        case 'admin/setLoading':
          return { ...state, loading: action.payload as boolean }
        case 'admin/setError':
          return { ...state, error: action.payload as string }
        case 'admin/setData':
          return { ...state, data: action.payload }
        default:
          return state
      }
    }

    const store = configureStore({
      reducer: {
        admin: adminReducer
      }
    })

    // Test loading state
    store.dispatch({ type: 'admin/setLoading', payload: true })
    expect(store.getState().admin.loading).toBe(true)

    // Test error state
    store.dispatch({ type: 'admin/setError', payload: 'Test error' })
    expect(store.getState().admin.error).toBe('Test error')

    // Test data state
    const testData = { test: 'data' }
    store.dispatch({ type: 'admin/setData', payload: testData })
    expect(store.getState().admin.data).toEqual(testData)
  })
})