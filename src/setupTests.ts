import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia
const matchMediaMock = () => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(matchMediaMock),
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

window.IntersectionObserver = mockIntersectionObserver;
