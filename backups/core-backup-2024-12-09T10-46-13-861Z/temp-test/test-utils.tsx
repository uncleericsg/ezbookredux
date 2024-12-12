import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Create a custom render function that includes providers if needed
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return {
    ...rtlRender(ui, {
      ...options,
      wrapper: ({ children }) => (
        <div id="radix-portal-root">
          {children}
        </div>
      ),
    }),
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };
