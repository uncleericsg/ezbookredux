import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';

// Extend Vitest's expect method with testing-library methods
expect.extend(matchers);

// Setup userEvent
const setup = () => {
  return userEvent.setup();
};

// Export setup for tests
export { setup as userEventSetup };

// Cleanup after each test case
afterEach(() => {
  cleanup();
}); 