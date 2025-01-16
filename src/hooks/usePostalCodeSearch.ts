import { useState } from 'react';
import { ApiError } from '../utils/errors';
import { NetworkUtils } from '../utils/network';

interface PostalCodeSearchResult {
  address: string;
  postalCode: string;
  latitude: number;
  longitude: number;
}

export function usePostalCodeSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPostalCode = async (postalCode: string): Promise<PostalCodeSearchResult | null> => {
    if (!postalCode || postalCode.length !== 6) {
      setError('Please enter a valid 6-digit postal code');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      if (!NetworkUtils.isOnline()) {
        throw new ApiError('No internet connection', 'NETWORK_ERROR');
      }

      const response = await fetch(`/api/geocode?postalCode=${postalCode}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new ApiError('Too many requests. Please try again later.', 'RATE_LIMIT_ERROR');
        }
        throw new ApiError('Failed to fetch address details', 'SERVICE_ERROR');
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        setError('No address found for this postal code');
        return null;
      }

      const result = data.results[0];
      return {
        address: result.formatted_address,
        postalCode: postalCode,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng
      };
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchPostalCode,
    loading,
    error
  };
}
