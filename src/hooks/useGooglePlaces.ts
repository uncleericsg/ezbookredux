/// <reference types="@types/google.maps" />

import { useState, useCallback, useEffect } from 'react';
import { initGoogleMaps, isGoogleMapsLoaded } from '@/services/googleMaps';
import { logger } from '@/utils/logger';
import type { ErrorMetadata } from '@/types/error';

interface UseGooglePlacesProps {
  onAddressSelect?: (address: string, placeId: string) => void;
  onError?: (error: Error) => void;
}

interface PlaceDetails {
  formatted_address: string;
  postal_code?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export const useGooglePlaces = ({ onAddressSelect, onError }: UseGooglePlacesProps = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
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
        const error = err instanceof Error ? err : new Error('Failed to initialize Google Places');
        setError(error);
        onError?.(error);
      }
    };

    if (!isInitialized) {
      initService();
    }
  }, [isInitialized, onError]);

  const searchAddress = useCallback(
    async (input: string) => {
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
            (results: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                resolve(results);
              } else {
                resolve([]);
              }
            }
          );
        });

        setSuggestions(predictions);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to search address');
        setError(error);
        onError?.(error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [service, isInitialized, onError]
  );

  const getPlaceDetails = useCallback(
    async (placeId: string): Promise<PlaceDetails | null> => {
      if (!service || !isInitialized) {
        throw new Error('Google Places API is not initialized');
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
            (result: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                const details: PlaceDetails = {
                  formatted_address: result.formatted_address || ''
                };

                if (result.geometry?.location) {
                  details.location = {
                    lat: result.geometry.location.lat(),
                    lng: result.geometry.location.lng()
                  };
                }

                const postalComponent = result.address_components?.find(
                  component => component.types.includes('postal_code')
                );
                if (postalComponent) {
                  details.postal_code = postalComponent.long_name;
                }

                resolve(details);
              } else {
                resolve(null);
              }
            }
          );
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get place details');
        onError?.(error);
        throw error;
      }
    },
    [service, isInitialized, onError]
  );

  const getPostalCode = useCallback(
    async (address: string): Promise<string | null> => {
      if (!isInitialized) {
        throw new Error('Google Places API is not initialized');
      }

      try {
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve, reject) => {
          geocoder.geocode(
            { address },
            (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
              if (status === google.maps.GeocoderStatus.OK && results && results.length > 0) {
                const postalComponent = results[0].address_components.find(
                  component => component.types.includes('postal_code')
                );
                resolve(postalComponent?.long_name || null);
              } else {
                resolve(null);
              }
            }
          );
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get postal code');
        onError?.(error);
        throw error;
      }
    },
    [isInitialized, onError]
  );

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
