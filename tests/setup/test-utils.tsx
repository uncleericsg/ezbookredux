import { render, RenderOptions } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { beforeAll, afterAll, afterEach } from 'vitest'

import { createMockStore } from './__mocks__/store'

// Frontend test utilities
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    ...renderOptions
  }: RenderOptions & { preloadedState?: any } = {}
) {
  const store = createMockStore(preloadedState)
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    )
  }
  
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Backend test utilities
export function createTestServer() {
  const server = setupServer(
    // Default handlers for common API endpoints
    http.get('/api/*', () => {
      return HttpResponse.json({})
    }),
    http.post('/api/*', () => {
      return HttpResponse.json({})
    }),
    http.put('/api/*', () => {
      return HttpResponse.json({})
    }),
    http.delete('/api/*', () => {
      return HttpResponse.json({})
    })
  )

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  return {
    server,
    // Helper to add custom handlers
    addHandler: (method: 'get' | 'post' | 'put' | 'delete', path: string, handler: Parameters<typeof http[typeof method]>[1]) => {
      server.use(
        http[method](path, handler)
      )
    },
    // Helper to simulate errors
    simulateError: (status: number) => {
      server.use(
        http.all('/api/*', () => {
          return new HttpResponse(null, { status })
        })
      )
    }
  }
}

// Integration test utilities
export function setupIntegrationTest() {
  const store = createMockStore()
  const server = createTestServer()

  return {
    store,
    server,
    cleanup: () => {
      server.server.close()
    }
  }
}

// Common test utilities
export function mockConsoleError() {
  const originalError = console.error
  beforeAll(() => {
    console.error = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: ReactDOM.render is no longer supported')
      ) {
        return
      }
      originalError.call(console, ...args)
    }
  })

  afterAll(() => {
    console.error = originalError
  })
}

export function mockConsoleWarn() {
  const originalWarn = console.warn
  beforeAll(() => {
    console.warn = (...args: any[]) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Warning: ')
      ) {
        return
      }
      originalWarn.call(console, ...args)
    }
  })

  afterAll(() => {
    console.warn = originalWarn
  })
}