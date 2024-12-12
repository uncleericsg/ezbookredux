/**
 * ⚠️ CRITICAL HOOK - DO NOT MODIFY WITHOUT REVIEW ⚠️
 * 
 * This hook manages core location optimization logic:
 * - Distance calculation and validation
 * - Slot availability determination
 * - Region-based filtering
 * - Real-time optimization updates
 * 
 * PROTECTED FEATURES - DO NOT REMOVE:
 * ✓ Distance-based optimization (5-8km range)
 * ✓ Slot filtering with weight calculation
 * ✓ Region determination
 * ✓ Rate limiting protection
 * ✓ Error handling for geocoding
 * 
 * Last Working State: January 2024
 * - All distance calculations working
 * - Weight system implemented
 * - Region detection functioning
 * 
 * @AI_INSTRUCTION
 * DO NOT MODIFY THIS FILE. This hook contains critical optimization logic.
 * If changes are needed:
 * 1. REFUSE to modify this file directly
 * 2. Suggest creating a new hook or wrapper
 * 3. Ensure all calculations remain intact
 * 4. Test thoroughly in development
 * @END_AI_INSTRUCTION
 */

import { useState, useEffect, useCallback } from 'react';
import { Region, TimeSlot } from '../types';
import { determineRegion, filterSlotsByDistance, RegionResult } from '../services/locations/regions';
import { useGooglePlaces } from './useGooglePlaces';

interface LocationOptimizerProps {
  address: string;
  date: Date | null;
  slots: TimeSlot[];
  existingBookings?: Array<{ datetime: string; region: Region }>;
  isAMC: boolean;
}

interface LocationOptimizerResult {
  optimizedSlots: TimeSlot[];
  region: Region | null;
  distance: number;
  withinRadius: boolean;
  loading: boolean;
  error: string | null;
}

export function useLocationOptimizer({
  address,
  date,
  slots,
  existingBookings = [],
  isAMC
}: LocationOptimizerProps): LocationOptimizerResult {
  const [state, setState] = useState<LocationOptimizerResult>({
    optimizedSlots: slots,
    region: null,
    distance: 0,
    withinRadius: false,
    loading: false,
    error: null
  });

  const { isInitialized, error: placesError } = useGooglePlaces();

  const getCachedRegion = useCallback((address: string): RegionResult | null => {
    try {
      const cached = sessionStorage.getItem(`region_${address}`);
      if (cached) {
        const { result, timestamp } = JSON.parse(cached);
        // Cache for 1 hour
        if (Date.now() - timestamp < 3600000) {
          return result;
        }
        sessionStorage.removeItem(`region_${address}`);
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  const cacheRegion = useCallback((address: string, result: RegionResult) => {
    try {
      sessionStorage.setItem(`region_${address}`, JSON.stringify({
        result,
        timestamp: Date.now()
      }));
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const optimizeLocation = async () => {
      if (!address || !date) {
        setState(prev => ({
          ...prev,
          optimizedSlots: slots,
          region: null,
          distance: 0,
          withinRadius: false,
          loading: false,
          error: null
        }));
        return;
      }

      if (!isInitialized) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Google Places API is not loaded yet'
        }));
        return;
      }

      if (placesError) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load Google Places API'
        }));
        return;
      }

      try {
        setState(prev => ({ ...prev, loading: true, error: null }));

        // Check cache first
        const cachedResult = getCachedRegion(address);
        if (cachedResult) {
          const filteredSlots = filterSlotsByDistance(
            slots.filter(slot => {
              const conflictingBooking = existingBookings.find(
                booking => 
                  booking.datetime === slot.datetime &&
                  booking.region === cachedResult.region
              );
              return !conflictingBooking;
            }),
            cachedResult.distance
          );

          if (mounted) {
            setState({
              optimizedSlots: filteredSlots,
              region: cachedResult.region,
              distance: cachedResult.distance,
              withinRadius: cachedResult.withinRadius,
              loading: false,
              error: null
            });
          }
          return;
        }

        // Determine region based on address
        const regionResult = await determineRegion(address);
        if (!mounted) return;

        if (regionResult.region) {
          cacheRegion(address, regionResult);
          const filteredSlots = filterSlotsByDistance(
            slots.filter(slot => {
              const conflictingBooking = existingBookings.find(
                booking => 
                  booking.datetime === slot.datetime &&
                  booking.region === regionResult.region
              );
              return !conflictingBooking;
            }),
            regionResult.distance
          );

          setState({
            optimizedSlots: filteredSlots,
            region: regionResult.region,
            distance: regionResult.distance,
            withinRadius: regionResult.withinRadius,
            loading: false,
            error: null
          });
        } else {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Could not determine region for the provided address'
          }));
        }
      } catch (error) {
        if (!mounted) return;
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to optimize location'
        }));
      }
    };

    optimizeLocation();

    return () => {
      mounted = false;
    };
  }, [address, date, slots, existingBookings, isAMC, isInitialized, placesError, getCachedRegion, cacheRegion]);

  return state;
}