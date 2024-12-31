import { vi, beforeAll } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Import vitest globals globally
import { describe, it, expect, beforeEach } from 'vitest';

// Extend global type declarations
declare global {
  interface Window {
    localStorage: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
      clear: () => void;
      removeItem: (key: string) => void;
    };
  }

  var testUtils: {
    getDistanceFromLatLonInKm: (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number
    ) => number;
  };
}

// Mock window and global objects
beforeAll(() => {
  // Initialize test utilities
  global.getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
  };

  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock window and document globally
  global.window = window;
  global.document = window.document;
  
  // Mock localStorage
  const localStorageMock = (() => {
    const store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});
