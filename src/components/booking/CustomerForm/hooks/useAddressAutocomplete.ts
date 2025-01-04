import { useState, useEffect, useRef, useCallback } from 'react';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Place {
  address_components?: AddressComponent[];
  formatted_address?: string;
}

interface AddressData {
  blockStreet: string;
  postalCode: string;
}

interface UseAddressAutocompleteProps {
  onAddressSelect: (data: AddressData) => void;
}

export const useAddressAutocomplete = ({ onAddressSelect }: UseAddressAutocompleteProps) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'sg' },
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      types: ['address']
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace() as Place;
      if (!place?.address_components) return;

      let blockNumber = '';
      let streetName = '';
      let postalCode = '';

      place.address_components.forEach(component => {
        const types = component.types;
        if (types.includes('street_number')) blockNumber = component.long_name;
        if (types.includes('route')) streetName = component.long_name;
        if (types.includes('postal_code')) postalCode = component.long_name;
      });

      const formattedAddress = blockNumber && streetName
        ? `${blockNumber} ${streetName}`.trim()
        : place.formatted_address || '';

      onAddressSelect({
        blockStreet: formattedAddress,
        postalCode: postalCode
      });
    });
  }, [onAddressSelect]);

  useEffect(() => {
    if (window.google?.maps) {
      setIsGoogleMapsLoaded(true);
      initializeAutocomplete();
    } else {
      const handleGoogleMapsLoaded = () => {
        setIsGoogleMapsLoaded(true);
        initializeAutocomplete();
      };

      window.addEventListener('google-maps-loaded', handleGoogleMapsLoaded);

      return () => {
        window.removeEventListener('google-maps-loaded', handleGoogleMapsLoaded);
      };
    }
  }, [initializeAutocomplete]);

  const handleInputBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    if (document.querySelector('.pac-container')?.contains(e.relatedTarget as Node)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }, []);

  return {
    isGoogleMapsLoaded,
    inputRef,
    handleInputBlur
  };
};

export default useAddressAutocomplete;