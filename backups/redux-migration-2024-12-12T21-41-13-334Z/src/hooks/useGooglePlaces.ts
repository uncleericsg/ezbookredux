import { useState, useEffect, useCallback } from 'react';
import { GooglePlacesService } from '../services/google/googlePlacesService';
import debounce from 'lodash/debounce';

interface UseGooglePlacesProps {
  onAddressSelect?: (address: string, placeId: string) => void;
  onError?: (error: Error) => void;
}

export const useGooglePlaces = ({ onAddressSelect, onError }: UseGooglePlacesProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [service, setService] = useState<GooglePlacesService | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeGooglePlaces = async () => {
      if (!mounted) return;
      
      try {
        setIsLoading(true);
        const newService = GooglePlacesService.getInstance();
        await newService.initialize();
        if (mounted) {
          setService(newService);
          setIsInitialized(true);
          setError(null);
        }
      } catch (err) {
        if (!mounted) return;
        const error = err instanceof Error ? err : new Error('Failed to initialize Google Places');
        setError(error);
        setIsInitialized(false);
        setService(null);
        onError?.(error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeGooglePlaces();

    return () => {
      mounted = false;
    };
  }, [onError]);

  const searchAddress = useCallback(
    debounce(async (input: string) => {
      if (!input?.trim() || !service || !isInitialized) {
        setSuggestions([]);
        return [];
      }

      setIsLoading(true);
      setError(null);

      try {
        const predictions = await service.searchAddress(input);
        setSuggestions(predictions);
        return predictions;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch address suggestions');
        setError(error);
        onError?.(error);
        setSuggestions([]);
        return [];
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [service, isInitialized, onError]
  );

  const getPlaceDetails = useCallback(
    async (placeId: string) => {
      if (!service || !isInitialized) {
        throw new Error('Google Places API is not initialized');
      }

      setIsLoading(true);
      setError(null);

      try {
        const details = await service.getPlaceDetails(placeId);
        if (details.formatted_address) {
          onAddressSelect?.(details.formatted_address, placeId);
        }
        return details;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch place details');
        setError(error);
        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [service, isInitialized, onAddressSelect, onError]
  );

  const getPostalCode = useCallback(
    async (address: string) => {
      if (!service || !isInitialized) {
        throw new Error('Google Places API is not initialized');
      }

      try {
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ address });
        
        if (response.results[0]) {
          const postalComponent = response.results[0].address_components.find(
            component => component.types.includes('postal_code')
          );
          return postalComponent?.long_name || null;
        }
        return null;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get postal code');
        onError?.(error);
        throw error;
      }
    },
    [service, isInitialized, onError]
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
