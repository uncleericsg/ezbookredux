import { z } from 'zod';
import { generateMockTimeSlots } from '../utils/cacheUtils';

const isDevelopment = process.env.NODE_ENV === 'development';

// Cache configuration schema
export const CacheConfigSchema = z.object({
  maxSize: z.number(),
  ttl: z.number(),
  cleanupInterval: z.number(),
  debug: z.boolean(),
  mockDelay: z.number().optional(),
});

export type CacheConfig = z.infer<typeof CacheConfigSchema>;

// Development vs Production configurations
export const CACHE_CONFIG: CacheConfig = {
  maxSize: isDevelopment ? 20 : 100,
  ttl: isDevelopment ? 60 * 1000 : 5 * 60 * 1000, // 1 min in dev, 5 mins in prod
  cleanupInterval: isDevelopment ? 30 * 1000 : 5 * 60 * 1000, // 30s in dev, 5 mins in prod
  debug: isDevelopment,
  mockDelay: isDevelopment ? 500 : undefined, // 500ms delay in dev
};

// Mock scenarios for different testing cases
export type MockScenario = 'normal' | 'busy' | 'limited' | 'maintenance';

export type TimeSlot = {
  datetime: string;
  available: boolean;
  duration: number;
};

export const MOCK_SCENARIOS: Record<MockScenario, {
  slots: TimeSlot[];
  description: string;
}> = {
  normal: {
    slots: generateMockTimeSlots('normal'),
    description: 'Regular day with normal availability'
  },
  busy: {
    slots: generateMockTimeSlots('busy'),
    description: 'High demand day with limited slots'
  },
  limited: {
    slots: generateMockTimeSlots('limited'),
    description: 'Few slots available'
  },
  maintenance: {
    slots: generateMockTimeSlots('maintenance'),
    description: 'Morning maintenance window'
  }
};

// Development tools configuration
export const DEV_TOOLS = {
  enabled: isDevelopment,
  features: {
    logging: true,
    monitoring: true,
    inspection: true,
    mockData: true
  },
  mockConfig: {
    scenario: 'normal' as MockScenario,
    delay: {
      min: 100,
      max: 1000
    },
    errorRate: 0.1 // 10% chance of error for testing
  }
};

// Cache performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  hitRate: 0.8, // 80% hit rate target
  maxLatency: 100, // 100ms max latency
  maxSize: 100,
  evictionRate: 0.1 // Alert if more than 10% of entries are evicted
};

// Debug utilities
export const debugLog = (message: string, data?: any) => {
  if (CACHE_CONFIG.debug) {
    console.log(`[Cache Debug] ${message}`, data || '');
  }
};

export const mockApiCall = async <T>(data: T): Promise<T> => {
  if (isDevelopment && CACHE_CONFIG.mockDelay) {
    await new Promise(resolve => setTimeout(resolve, CACHE_CONFIG.mockDelay));
  }
  return data;
};
