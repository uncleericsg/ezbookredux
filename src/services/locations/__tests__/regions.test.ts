import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getDistanceFromLatLonInKm, 
  filterSlotsByDistance, 
  MIN_DISTANCE_KM,
  MAX_DISTANCE_KM,
  getDistanceWeight
} from '../regions';
import { TimeSlot } from '../../../types';

describe('Location Services', () => {
  describe('getDistanceWeight', () => {
    it('should return 1 for distances under MIN_DISTANCE_KM', () => {
      expect(getDistanceWeight(MIN_DISTANCE_KM - 1)).toBe(1);
      expect(getDistanceWeight(MIN_DISTANCE_KM - 0.5)).toBe(1);
    });

    it('should return scaled weight for distances between MIN and MAX', () => {
      const midPoint = (MIN_DISTANCE_KM + MAX_DISTANCE_KM) / 2; // 6.5km
      const midWeight = getDistanceWeight(midPoint);
      expect(midWeight).toBeCloseTo(0.45, 2);

      const quarterPoint = MIN_DISTANCE_KM + (MAX_DISTANCE_KM - MIN_DISTANCE_KM) * 0.25; // 5.75km
      const quarterWeight = getDistanceWeight(quarterPoint);
      expect(quarterWeight).toBeCloseTo(0.675, 2);
    });

    it('should return 0 for distances beyond MAX_DISTANCE_KM', () => {
      expect(getDistanceWeight(MAX_DISTANCE_KM + 0.1)).toBe(0);
      expect(getDistanceWeight(MAX_DISTANCE_KM + 1)).toBe(0);
    });
  });

  describe('filterSlotsByDistance', () => {
    const mockSlots: TimeSlot[] = [
      {
        id: '1',
        datetime: '2024-01-01T09:00:00Z',
        available: true
      },
      {
        id: '2',
        datetime: '2024-01-01T10:00:00Z',
        available: true
      }
    ];

    it('should assign weight 1 for distances under MIN_DISTANCE_KM', () => {
      const distance = MIN_DISTANCE_KM - 1;
      const filteredSlots = filterSlotsByDistance(mockSlots, distance);
      expect(filteredSlots[0].weight).toBe(1);
      expect(filteredSlots[1].weight).toBe(1);
    });

    it('should assign scaled weights for distances between MIN and MAX', () => {
      const distance = (MIN_DISTANCE_KM + MAX_DISTANCE_KM) / 2; // 6.5km
      const filteredSlots = filterSlotsByDistance(mockSlots, distance);
      expect(filteredSlots[0].weight).toBeCloseTo(0.45, 2);
      expect(filteredSlots[1].weight).toBeCloseTo(0.45, 2);
    });

    it('should mark slots as unavailable when beyond MAX_DISTANCE_KM', () => {
      const distance = MAX_DISTANCE_KM + 1;
      const filteredSlots = filterSlotsByDistance(mockSlots, distance);
      expect(filteredSlots.every(slot => !slot.available)).toBe(true);
    });
  });

  describe('getDistanceFromLatLonInKm', () => {
    it('should calculate correct distance between two points', () => {
      const point1 = { latitude: 1.3329, longitude: 103.7436 }; // Jurong East
      const point2 = { latitude: 1.4291, longitude: 103.8354 }; // Yishun
      const distance = getDistanceFromLatLonInKm(point1, point2);
      expect(distance).toBeCloseTo(11.5, 1);
    });
  });
});
