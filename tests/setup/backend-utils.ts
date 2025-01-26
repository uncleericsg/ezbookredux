import { createClient } from '@supabase/supabase-js'
import type { Database } from '@types/supabase'

// Test database client
export const createTestClient = () => {
  const supabase = createClient<Database>(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
  )
  return supabase
}

// Mock database responses
export const mockDbResponse = <T>(data: T) => ({
  data,
  error: null,
  status: 200,
  statusText: 'OK',
  count: null
})

// Mock database error
export const mockDbError = (message: string, code = 'ERROR') => ({
  data: null,
  error: { message, code },
  status: 400,
  statusText: 'Bad Request',
  count: null
})

// Test data generators
export const generateTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  created_at: new Date().toISOString(),
  ...overrides
})

export const generateTestBooking = (overrides = {}) => ({
  id: 'test-booking-id',
  user_id: 'test-user-id',
  service_type: 'general',
  status: 'pending',
  created_at: new Date().toISOString(),
  ...overrides
})

// Helper to clear test data
export const clearTestData = async (supabase = createTestClient()) => {
  const tables = ['users', 'bookings', 'payments', 'notifications']
  await Promise.all(
    tables.map(table => 
      supabase.from(table).delete().match({ id: /^test-.*/ })
    )
  )
} 