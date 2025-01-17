import { describe, expect, it } from 'vitest';
import type { TimeSlot } from '@/types/timeSlot';
import { getRegionFromPostalCode, isLocationInRegion, RegionKey } from '../classifier';

describe('Region Classification', () => {
  describe('getRegionFromPostalCode', () => {
    it('should correctly classify postal codes to regions', () => {
      expect(getRegionFromPostalCode('650101')).toBe('NORTH');
      expect(getRegionFromPostalCode('089123')).toBe('SOUTH');
      expect(getRegionFromPostalCode('469001')).toBe('EAST');
      expect(getRegionFromPostalCode('120001')).toBe('WEST');
      expect(getRegionFromPostalCode('310001')).toBe('CENTRAL');
    });

    it('should return null for invalid postal codes', () => {
      expect(getRegionFromPostalCode('')).toBeNull();
      expect(getRegionFromPostalCode('1')).toBeNull();
      expect(getRegionFromPostalCode('999999')).toBeNull();
    });
  });

  describe('isLocationInRegion', () => {
    it('should correctly identify locations within regions', () => {
      // North region test
      expect(isLocationInRegion(1.429, 103.836, 'NORTH')).toBe(true);
      expect(isLocationInRegion(1.439, 103.846, 'NORTH')).toBe(true);
      expect(isLocationInRegion(1.419, 103.826, 'NORTH')).toBe(true);

      // South region test
      expect(isLocationInRegion(1.270, 103.819, 'SOUTH')).toBe(true);
      expect(isLocationInRegion(1.280, 103.829, 'SOUTH')).toBe(true);
      expect(isLocationInRegion(1.260, 103.809, 'SOUTH')).toBe(true);

      // East region test
      expect(isLocationInRegion(1.352, 103.940, 'EAST')).toBe(true);
      expect(isLocationInRegion(1.362, 103.950, 'EAST')).toBe(true);
      expect(isLocationInRegion(1.342, 103.930, 'EAST')).toBe(true);
    });

    it('should correctly identify locations outside regions', () => {
      // Test points far from any region
      expect(isLocationInRegion(1.0, 103.0, 'NORTH')).toBe(false);
      expect(isLocationInRegion(2.0, 104.0, 'SOUTH')).toBe(false);
      expect(isLocationInRegion(1.5, 104.5, 'EAST')).toBe(false);
    });
  });

  describe('Time Slot Region Classification', () => {
    const createTimeSlot = (lat: number, lng: number): TimeSlot => ({
      id: '1',
      startTime: '2024-01-20T09:00:00Z',
      endTime: '2024-01-20T10:00:00Z',
      isAvailable: true,
      isPeakHour: false,
      priceMultiplier: 1,
      serviceId: null,
      technicianId: null,
      status: 'available',
      blockReason: null,
      metadata: {
        location: { lat, lng }
      },
      duration: 60,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z'
    });

    it('should correctly classify time slots based on location', () => {
      const northSlot = createTimeSlot(1.429, 103.836);
      const southSlot = createTimeSlot(1.270, 103.819);
      const eastSlot = createTimeSlot(1.352, 103.940);

      expect(isLocationInRegion(
        northSlot.metadata?.location?.lat || 0,
        northSlot.metadata?.location?.lng || 0,
        'NORTH'
      )).toBe(true);

      expect(isLocationInRegion(
        southSlot.metadata?.location?.lat || 0,
        southSlot.metadata?.location?.lng || 0,
        'SOUTH'
      )).toBe(true);

      expect(isLocationInRegion(
        eastSlot.metadata?.location?.lat || 0,
        eastSlot.metadata?.location?.lng || 0,
        'EAST'
      )).toBe(true);
    });
  });
});
