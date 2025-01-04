import { useState, useEffect, useRef, useCallback } from 'react';

interface AddressData {
  blockStreet: string;
  postalCode: string;
  buildingName?: string;
}

interface UseAddressAutocompleteProps {
  onAddressSelect: (data: AddressData) => void;
}

export const useAddressAutocomplete = ({ onAddressSelect }: UseAddressAutocompleteProps) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePlaceSelect = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components) {
      console.error('No address components in place data:', place);
      return;
    }

    let blockNumber = '';
    let streetName = '';
    let postalCode = '';
    let buildingName = '';

    // Log all components for debugging
    console.log('Address components:', place.address_components);

    // Extract address components
    place.address_components.forEach(component => {
      const types = component.types;
      console.log('Component:', { types, long_name: component.long_name });
      
      if (types.includes('street_number')) {
        blockNumber = component.long_name;
        console.log('Found block number:', blockNumber);
      }
      if (types.includes('route')) {
        streetName = component.long_name;
        console.log('Found street name:', streetName);
      }
      if (types.includes('postal_code')) {
        postalCode = component.long_name;
        console.log('Found postal code:', postalCode);
      }
      // Try to get building name from premise or establishment
      if (types.includes('premise') || types.includes('establishment')) {
        buildingName = component.long_name;
        console.log('Found building name:', buildingName);
      }
    });

    // If no postal code found in address_components, try to extract from formatted address
    if (!postalCode && place.formatted_address) {
      const postalMatch = place.formatted_address.match(/Singapore\s+(\d{6})/i);
      if (postalMatch) {
        postalCode = postalMatch[1];
        console.log('Extracted postal code from formatted address:', postalCode);
      }
    }

    // Format the block and street address
    const formattedAddress = blockNumber && streetName
      ? `${blockNumber} ${streetName}`
      : place.name || place.formatted_address?.split(',')[0] || '';

    console.log('Final address data:', {
      blockStreet: formattedAddress,
      postalCode,
      buildingName
    });

    onAddressSelect({
      blockStreet: formattedAddress,
      postalCode,
      buildingName
    });
  }, [onAddressSelect]);

  const initializeAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'sg' },
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      types: ['address']
    });

    // Prevent form submission when selecting from autocomplete
    inputRef.current.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && document.querySelector('.pac-container')) {
        e.preventDefault();
      }
    });

    // Prevent the default blur behavior when selecting from autocomplete
    inputRef.current.addEventListener('blur', (e: FocusEvent) => {
      if (document.querySelector('.pac-container')?.contains(e.relatedTarget as Node)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    });

    autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
  }, [handlePlaceSelect]);

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

  const setInputRef = useCallback((el: HTMLInputElement | null) => {
    inputRef.current = el;
  }, []);

  return {
    isGoogleMapsLoaded,
    setInputRef
  };
};

export default useAddressAutocomplete;