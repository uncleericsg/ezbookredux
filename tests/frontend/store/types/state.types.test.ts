import { describe, it, expect } from 'vitest'

import { createMockStore } from '../../../setup/__mocks__/store'

import type { RootState } from '../../../../src/store/types/state.types'

describe('Redux State Types', () => {
  it('should match the expected state structure', () => {
    const store = createMockStore()
    const state = store.getState()

    // Test state structure
    expect(state).toHaveProperty('admin')
    expect(state).toHaveProperty('auth')
    expect(state).toHaveProperty('booking')
    expect(state).toHaveProperty('service')
    expect(state).toHaveProperty('technician')
    expect(state).toHaveProperty('user')

    // Test initial state values
    expect(state.admin).toEqual({
      loading: false,
      error: null,
      data: null
    })

    expect(state.auth).toEqual({
      loading: false,
      error: null,
      token: null,
      user: null
    })

    expect(state.booking).toEqual({
      bookings: [],
      loading: false,
      error: null
    })

    expect(state.service).toEqual({
      services: [],
      loading: false,
      error: null
    })

    expect(state.technician).toEqual({
      currentTechnician: null,
      technicians: [],
      schedules: [],
      loading: false,
      error: null
    })

    expect(state.user).toEqual({
      profile: null,
      loading: false,
      error: null
    })
  })

  it('should allow type-safe access to state', () => {
    const testUser = {
      profile: null,
      loading: false,
      error: null
    }

    const store = createMockStore({
      user: testUser
    })

    const state = store.getState() as RootState
    
    // Type-safe access should work without type errors
    const { profile, loading, error } = state.user
    
    expect(profile).toBeNull()
    expect(loading).toBe(false)
    expect(error).toBeNull()
  })

  it('should maintain type safety with nested state', () => {
    const testTechnician = {
      currentTechnician: {
        id: '1',
        name: 'Test Tech',
        schedule: []
      },
      technicians: [],
      schedules: [],
      loading: false,
      error: null
    }

    const store = createMockStore({
      technician: testTechnician
    })

    const state = store.getState() as RootState
    
    // Type-safe access to nested properties
    const { currentTechnician } = state.technician
    expect(currentTechnician).toBeDefined()
    expect(currentTechnician?.name).toBe('Test Tech')
    expect(currentTechnician?.schedule).toEqual([])
  })
})