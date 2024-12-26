import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2 } from 'lucide-react';
import { useAddressAutocomplete } from '@hooks/useAddressAutocomplete';
import type { PlaceDetails } from '@services/googlePlaces';

interface AddressAutocompleteProps {
  onSelect: (details: PlaceDetails) => void;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  error?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  value,
  onChange,
  className = '',
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    predictions,
    loading,
    error: autocompleteError,
    fetchPredictions,
    handleSelect
  } = useAddressAutocomplete({
    onSelect,
    debounceMs: 300
  });

  const handlePredictionSelect = async (prediction: google.maps.places.AutocompletePrediction) => {
    if (inputRef.current) {
      inputRef.current.value = prediction.description;
      onChange(prediction.description);
    }
    await handleSelect(prediction.place_id);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value;
            onChange(newValue);
            fetchPredictions(newValue);
          }}
          placeholder="Enter your address"
          className={`w-full bg-gray-700 border rounded-lg pl-10 pr-4 py-2 ${
            error ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
          } ${className}`}
        />
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
          >
            {predictions.map((prediction) => (
              <button
                key={prediction.place_id}
                onClick={() => handlePredictionSelect(prediction)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <p className="text-sm font-medium">{prediction.structured_formatting.main_text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {(error || autocompleteError) && (
        <p className="mt-1 text-sm text-red-500">{error || autocompleteError}</p>
      )}
    </div>
  );
};
