import { z } from 'zod';

// Environment variable schema
const envSchema = z.object({
  VITE_ONEMAP_API_TOKEN: z.string().min(1, 'OneMap API token is required'),
  VITE_ONEMAP_API_URL: z.string().url('Invalid OneMap API URL'),
  VITE_ONEMAP_EMAIL: z.string().email('Invalid email address'),
  VITE_ONEMAP_PASSWORD: z.string().min(1, 'Password is required'),
});

// Default configuration
export const defaultConfig = {
  API_URL: 'https://developers.onemap.sg/commonapi',
  ENDPOINTS: {
    SEARCH: '/search',
    REVERSE_GEOCODE: '/reverseMap',
  },
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
  RATE_LIMIT: {
    MAX_REQUESTS: 500,
    WINDOW_MS: 60 * 1000, // 1 minute
  },
};

// Validate environment variables
const validateEnv = (): z.infer<typeof envSchema> => {
  try {
    return envSchema.parse({
      VITE_ONEMAP_API_TOKEN: import.meta.env.VITE_ONEMAP_API_TOKEN,
      VITE_ONEMAP_API_URL: import.meta.env.VITE_ONEMAP_API_URL || defaultConfig.API_URL,
      VITE_ONEMAP_EMAIL: import.meta.env.VITE_ONEMAP_EMAIL,
      VITE_ONEMAP_PASSWORD: import.meta.env.VITE_ONEMAP_PASSWORD,
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Missing or invalid environment variables for OneMap API');
  }
};

// Export validated configuration
export const oneMapConfig = {
  VITE_ONEMAP_API_URL: import.meta.env.VITE_ONEMAP_API_URL as string,
  VITE_ONEMAP_EMAIL: import.meta.env.VITE_ONEMAP_EMAIL as string,
  VITE_ONEMAP_PASSWORD: import.meta.env.VITE_ONEMAP_PASSWORD as string,
  ENDPOINTS: {
    SEARCH: '/search',
    REVERSE_GEOCODE: '/reverse-geocode',
  },
  RATE_LIMIT: {
    MAX_REQUESTS: 250,
    WINDOW_MS: 60 * 1000, // 1 minute
  }
};

// Type definitions for OneMap API responses
export interface OneMapSearchResult {
  SEARCHVAL: string;
  BLK_NO: string;
  ROAD_NAME: string;
  BUILDING: string;
  ADDRESS: string;
  POSTAL: string;
  X: string;
  Y: string;
  LATITUDE: string;
  LONGITUDE: string;
}

export interface OneMapSearchResponse {
  found: number;
  totalNumPages: number;
  pageNum: number;
  results: OneMapSearchResult[];
}

export interface OneMapError {
  error: string;
  message: string;
}

export function isOneMapError(response: any): response is OneMapError {
  return response && typeof response.error === 'string';
}
