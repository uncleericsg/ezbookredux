import { useState, useEffect, useCallback } from 'react';
import type { TimeSlot } from '../types';

interface OfflineData {
  slots: TimeSlot[];
  timestamp: number;
  version: number;
}

const STORAGE_KEY = 'booking_offline_data';
const CACHE_VERSION = 1;
const MAX_OFFLINE_AGE = 24 * 60 * 60 * 1000; // 24 hours

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  // Load offline data on mount
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data: OfflineData = JSON.parse(stored);
          
          // Version check
          if (data.version !== CACHE_VERSION) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }

          // Age check
          if (Date.now() - data.timestamp > MAX_OFFLINE_AGE) {
            localStorage.removeItem(STORAGE_KEY);
            return null;
          }

          setOfflineData(data);
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    loadOfflineData();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save data for offline use
  const saveForOffline = useCallback((slots: TimeSlot[]) => {
    try {
      const data: OfflineData = {
        slots,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setOfflineData(data);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }, []);

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setOfflineData(null);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, []);

  return {
    isOnline,
    offlineData,
    saveForOffline,
    clearOfflineData
  };
};
