// Basic implementation without advanced TypeScript features
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMockStore } from './__mocks__/store'
import { MemoryRouter } from 'react-router-dom'

export function renderWithProviders(ui, options = {}) {
  const { route = '/', preloadedState = {} } = options
  const store = createMockStore(preloadedState)
  
  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </Provider>
  )

  return {
    ...render(ui, { wrapper }),
    store
  }
}