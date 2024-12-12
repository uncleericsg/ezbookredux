import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';
import { initGooglePlaces, getPlacePredictions, getPlaceDetails, PlaceDetails } from '../services/googlePlaces';

interface UseAddressAutocompleteProps {
  onSelect: (details: PlaceDetails) => void;
  debounceMs?: number;
}

export const useAddressAutocomplete = ({
  onSelect,
  debounceMs = 300
}: UseAddressAutocompleteProps) => {
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);

  useEffect(() => {
    const initService = async () => {
      try {
        autocompleteServiceRef.current = await initGooglePlaces();
      } catch (err) {
        setError('Failed to initialize Google Places service');
      }
    };

    initService();
  }, []);

  const fetchPredictions = useCallback(
    debounce(async (input: string) => {
      if (!input || !autocompleteServiceRef.current) return;

      setLoading(true);
      try {
        const results = await getPlacePredictions(input, autocompleteServiceRef.current);
        setPredictions(results);
        setError(null);
      } catch (err) {
        setError('Failed to fetch address suggestions');
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    []
  );

  const handleSelect = async (placeId: string) => {
    setLoading(true);
    try {
      const details = await getPlaceDetails(placeId);
      if (details) {
        onSelect(details);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch address details');
    } finally {
      setLoading(false);
      setPredictions([]);
    }
  };

  return {
    predictions,
    loading,
    error,
    fetchPredictions,
    handleSelect
  };
};
