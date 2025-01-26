import { rest } from 'msw'
import type { PathParams } from 'msw'

// API endpoints
const API_BASE = '/api'

// Handler types
type RequestBody = Record<string, unknown>
type ResponseBody = Record<string, unknown>

// Basic handlers
export const handlers = [
  // Auth handlers
  rest.post<RequestBody, PathParams, ResponseBody>(
    `${API_BASE}/auth/login`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ success: true }))
    }
  ),

  // User handlers
  rest.get<RequestBody, PathParams, ResponseBody>(
    `${API_BASE}/user/profile`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        })
      )
    }
  ),

  // Booking handlers
  rest.post<RequestBody, PathParams, ResponseBody>(
    `${API_BASE}/booking/create`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ bookingId: '123' }))
    }
  ),

  // Payment handlers
  rest.post<RequestBody, PathParams, ResponseBody>(
    `${API_BASE}/payment/process`,
    async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json({ transactionId: '456' }))
    }
  )
] 