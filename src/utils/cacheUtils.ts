import { TimeSlot } from '@types';
import { Region } from '@services/locations/regions';
import { debugLog } from '@config/cacheConfig';

// Cache performance metrics
interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  size: number;
  averageAccessTime: number;
}

class CacheMonitor {
  private static instance: CacheMonitor;
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    averageAccessTime: 0
  };
  private accessTimes: number[] = [];

  private constructor() {}

  static getInstance(): CacheMonitor {
    if (!CacheMonitor.instance) {
      CacheMonitor.instance = new CacheMonitor();
    }
    return CacheMonitor.instance;
  }

  recordHit(accessTime: number) {
    this.metrics.hits++;
    this.recordAccessTime(accessTime);
    debugLog('Cache hit recorded', { metrics: this.metrics });
  }

  recordMiss() {
    this.metrics.misses++;
    debugLog('Cache miss recorded', { metrics: this.metrics });
  }

  recordEviction() {
    this.metrics.evictions++;
    debugLog('Cache eviction recorded', { metrics: this.metrics });
  }

  updateSize(size: number) {
    this.metrics.size = size;
  }

  private recordAccessTime(time: number) {
    this.accessTimes.push(time);
    if (this.accessTimes.length > 100) {
      this.accessTimes.shift();
    }
    this.metrics.averageAccessTime = 
      this.accessTimes.reduce((a, b) => a + b, 0) / this.accessTimes.length;
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  reset() {
    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      size: 0,
      averageAccessTime: 0
    };
    this.accessTimes = [];
    debugLog('Cache metrics reset');
  }
}

// Enhanced mock data scenarios
export const generateMockTimeSlots = (scenario: 'normal' | 'busy' | 'limited' | 'maintenance'): TimeSlot[] => {
  const baseDate = new Date();
  baseDate.setHours(9, 0, 0, 0); // Start at 9 AM

  const generateTimeSlot = (date: Date, available: boolean): TimeSlot => ({
    id: date.toISOString(),
    date: date.toISOString().split('T')[0],
    startTime: date.toISOString(),
    endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(), // 1 hour duration
    isAvailable: available,
    isBlocked: !available,
    blockReason: !available ? 'Slot not available' : undefined
  });

  switch (scenario) {
    case 'normal':
      return Array.from({ length: 8 }, (_, i) => {
        const slotDate = new Date(baseDate.getTime() + i * 60 * 60 * 1000);
        return generateTimeSlot(slotDate, true);
      });

    case 'busy':
      return Array.from({ length: 8 }, (_, i) => {
        const slotDate = new Date(baseDate.getTime() + i * 60 * 60 * 1000);
        return generateTimeSlot(slotDate, i % 3 !== 0); // Only some slots available
      });

    case 'limited':
      return Array.from({ length: 3 }, (_, i) => {
        const slotDate = new Date(baseDate.getTime() + i * 60 * 60 * 1000);
        return generateTimeSlot(slotDate, true);
      });

    case 'maintenance':
      return Array.from({ length: 8 }, (_, i) => {
        const slotDate = new Date(baseDate.getTime() + i * 60 * 60 * 1000);
        const isAvailable = i >= 4;
        return {
          ...generateTimeSlot(slotDate, isAvailable),
          blockReason: !isAvailable ? 'Maintenance window' : undefined
        };
      });

    default:
      return [];
  }
};

// Cache inspection tools
export const inspectCache = (cache: Map<string, any>) => {
  const inspection = {
    size: cache.size,
    keys: Array.from(cache.keys()),
    oldestEntry: null as any,
    newestEntry: null as any,
    expiringWithin: {
      '1min': 0,
      '5min': 0,
      '15min': 0,
    },
  };

  const now = Date.now();
  let oldestTimestamp = Infinity;
  let newestTimestamp = 0;

  cache.forEach((value, key) => {
    const timestamp = value.timestamp;
    if (timestamp < oldestTimestamp) {
      oldestTimestamp = timestamp;
      inspection.oldestEntry = { key, value };
    }
    if (timestamp > newestTimestamp) {
      newestTimestamp = timestamp;
      inspection.newestEntry = { key, value };
    }

    const expiresIn = timestamp + value.ttl - now;
    if (expiresIn <= 60000) inspection.expiringWithin['1min']++;
    if (expiresIn <= 300000) inspection.expiringWithin['5min']++;
    if (expiresIn <= 900000) inspection.expiringWithin['15min']++;
  });

  debugLog('Cache inspection results', inspection);
  return inspection;
};

export const monitor = CacheMonitor.getInstance();

export const createCacheKey = (params: {
  date: Date;
  region: Region;
  isAMC: boolean;
  bookings?: string[];
}) => {
  const { date, region, isAMC, bookings = [] } = params;
  return `${date.toISOString()}_${region}_${isAMC}_${bookings.sort().join(',')}`;
};
