import { renderWithProviders } from './renderWithProviders'
import { createTestClient } from './backend-utils'
import { createTestStore } from './__mocks__/store'
import type { RenderOptions } from '@testing-library/react'

// Integration test setup
export interface IntegrationTestContext {
  store: ReturnType<typeof createTestStore>['store']
  supabase: ReturnType<typeof createTestClient>
  cleanup: () => Promise<void>
}

// Setup integration test environment
export const setupIntegrationTest = async (): Promise<IntegrationTestContext> => {
  const store = createTestStore().store
  const supabase = createTestClient()
  
  const cleanup = async () => {
    // Clear store
    store.dispatch({ type: 'RESET_STATE' })
    // Clear test data
    await supabase
      .from('test_data')
      .delete()
      .match({ environment: 'test' })
  }

  return {
    store,
    supabase,
    cleanup
  }
}

// Render component with integration context
export const renderWithIntegration = async (
  ui: React.ReactElement,
  options: Partial<RenderOptions> = {}
) => {
  const context = await setupIntegrationTest()
  const rendered = renderWithProviders(ui, {
    ...options,
    preloadedState: context.store.getState()
  })

  return {
    ...rendered,
    ...context
  }
}

// Integration test helpers
export const waitForApiCall = (path: string) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const calls = window.fetch.mock.calls
      const found = calls.find(([url]) => url.includes(path))
      if (found) {
        clearInterval(interval)
        resolve(found)
      }
    }, 50)
  })
}

export const simulateApiResponse = (path: string, response: unknown) => {
  window.fetch.mockImplementationOnce((url: string) => {
    if (url.includes(path)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response)
      })
    }
    return window.fetch.getMockImplementation()(url)
  })
} 