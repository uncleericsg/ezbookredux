import { useState } from 'react';
import { OneMapService } from '../services/onemap/oneMapService';
import { RateLimitError, NetworkError } from '../types/errors';
import type { AddressDetails } from '../types';

interface AddressDetails {
  blockNumber: string;
  streetName: string;
  buildingName: string;
}

export const usePostalCodeSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddress = async (postalCode: string): Promise<AddressDetails | null> => {
    if (!postalCode || postalCode.length !== 6) {
      setError('Please enter a valid 6-digit postal code');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const oneMapService = OneMapService.getInstance();
      const data = await oneMapService.searchByPostalCode(postalCode);

      if (data.found === 0) {
        setError('No address found. You may enter the address manually.');
        return null;
      }

      const result = data.results[0];
      return {
        blockNumber: result.BLK_NO,
        streetName: result.ROAD_NAME,
        buildingName: result.BUILDING
      };
    } catch (err) {
      if (err instanceof RateLimitError) {
        setError('Too many requests. Please try again in a moment.');
      } else if (err instanceof NetworkError) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Unable to fetch address. You may enter the address manually.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchAddress,
    loading,
    error
  };
};
