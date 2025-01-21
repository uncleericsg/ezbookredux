/// <reference types="@types/google.maps" />

import { useState, useCallback, useEffect } from 'react';
import { 
  initGoogleMaps, 
  isGoogleMapsLoaded,
  mapPrediction,
  mapPlaceResult,
  type PlaceDetails,
  type PlacePrediction
} from '@/services/googleMaps';
import { APIError } from '@/utils/apiErrors';
import { logger } from '@/utils/logger';

interface UseGooglePlacesProps {
  onAddressSelect?: (address: string, placeId: string) => void;
  onError?: (error: Error) => void;
}

interface UseGooglePlacesResult {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  suggestions: PlacePrediction[];
  searchAddress: (input: string) => Promise<void>;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails | null>;
  getPostalCode: (address: string) => Promise<string | null>;
}

export const useGooglePlaces = (
  { onAddressSelect, onError }: UseGooglePlacesProps = {}
): UseGooglePlacesResult => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [service, setService] = useState<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    const initService = async () => {
      try {
        if (!isGoogleMapsLoaded()) {
          await initGoogleMaps();
        }
        setService(new google.maps.places.AutocompleteService());
        setIsInitialized(true);
      } catch (err) {
        const error = err instanceof APIError ? err : new APIError(
          'PLACES_INIT_ERROR',
          'Failed to initialize Google Places',
          500,
          { originalError: err }
        );
        logger.error('Google Places initialization failed', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        setError(error);
        onError?.(error);
      }
    };

    if (!isInitialized) {
      initService();
    }
  }, [isInitialized, onError]);

  const searchAddress = useCallback(async (input: string): Promise<void> => {
    if (!input.trim() || !service || !isInitialized) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const predictions = await new Promise<google.maps.places.AutocompletePrediction[]>((resolve, reject) => {
        service.getPlacePredictions(
          {
            input,
            componentRestrictions: { country: 'SG' },
            types: ['address']
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              reject(new Error(`Places API returned status: ${status}`));
            }
          }
        );
      });

      setSuggestions(predictions.map(mapPrediction));
    } catch (err) {
      const error = err instanceof APIError ? err : new APIError(
        'PLACES_SEARCH_ERROR',
        'Failed to search address',
        500,
        { originalError: err }
      );
      setError(error);
      onError?.(error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [service, isInitialized, onError]);

  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    if (!isInitialized) {
      throw new APIError(
        'PLACES_NOT_INITIALIZED',
        'Google Places API is not initialized',
        500
      );
    }

    try {
      const tempDiv = document.createElement('div');
      const placeService = new google.maps.places.PlacesService(tempDiv);

      return new Promise((resolve, reject) => {
        placeService.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'address_components', 'geometry']
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(mapPlaceResult(result));
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve(null);
            } else {
              reject(new APIError(
                'PLACE_DETAILS_ERROR',
                `Failed to get place details: ${status}`,
                500
              ));
            }
          }
        );
      });
    } catch (err) {
      const error = err instanceof APIError ? err : new APIError(
        'PLACE_DETAILS_ERROR',
        'Failed to get place details',
        500,
        { originalError: err }
      );
      onError?.(error);
      throw error;
    }
  }, [isInitialized, onError]);

  const getPostalCode = useCallback(async (address: string): Promise<string | null> => {
    if (!isInitialized) {
      throw new APIError(
        'PLACES_NOT_INITIALIZED',
        'Google Places API is not initialized',
        500
      );
    }

    try {
      const geocoder = new google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode(
          { address },
          (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
              const postalComponent = results[0].address_components.find(
                component => component.types.includes('postal_code')
              );
              resolve(postalComponent?.long_name || null);
            } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
              resolve(null);
            } else {
              reject(new APIError(
                'GEOCODE_ERROR',
                `Geocoding failed: ${status}`,
                500
              ));
            }
          }
        );
      });
    } catch (err) {
      const error = err instanceof APIError ? err : new APIError(
        'GEOCODE_ERROR',
        'Failed to get postal code',
        500,
        { originalError: err }
      );
      onError?.(error);
      throw error;
    }
  }, [isInitialized, onError]);

  return {
    isInitialized,
    isLoading,
    error,
    suggestions,
    searchAddress,
    getPlaceDetails,
    getPostalCode
  };
};
