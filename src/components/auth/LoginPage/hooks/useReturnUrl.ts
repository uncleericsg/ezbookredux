import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AUTH_CONSTANTS } from '../constants';
import type { UseReturnUrlReturn } from '../types';

/**
 * Hook to manage return URL and booking data persistence
 * Used when users need to authenticate during booking flow
 */
export const useReturnUrl = (): UseReturnUrlReturn => {
  const location = useLocation();

  // Get return data from location state or session storage
  const getReturnData = useCallback(() => {
    if (location.state) {
      return location.state;
    }
    const storedBooking = sessionStorage.getItem(AUTH_CONSTANTS.PENDING_BOOKING_KEY);
    return storedBooking ? JSON.parse(storedBooking) : null;
  }, [location.state]);

  // Set return data in session storage
  const setReturnData = useCallback((data: { returnUrl: string; bookingData?: any }) => {
    if (data.bookingData) {
      sessionStorage.setItem(
        AUTH_CONSTANTS.PENDING_BOOKING_KEY,
        JSON.stringify({
          returnUrl: data.returnUrl,
          bookingData: data.bookingData
        })
      );
    } else {
      sessionStorage.removeItem(AUTH_CONSTANTS.PENDING_BOOKING_KEY);
    }
  }, []);

  // Get current return data
  const returnData = getReturnData();
  const returnUrl = returnData?.returnUrl || '/';
  const bookingData = returnData?.bookingData;

  return {
    returnUrl,
    bookingData,
    setReturnData
  };
};