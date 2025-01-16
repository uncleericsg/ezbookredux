import { useEffect, useRef, useState } from 'react';
import { Input } from './input';

interface AddressAutocompleteProps {
  onSelect: (place: google.maps.places.PlaceResult) => void;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
}

export function AddressAutocomplete({
  onSelect,
  defaultValue = '',
  className,
  placeholder = 'Enter your address'
}: AddressAutocompleteProps) {
  const [value, setValue] = useState(defaultValue);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { country: 'SG' },
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      types: ['address']
    };

    autoCompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    autoCompleteRef.current.addListener('place_changed', () => {
      if (!autoCompleteRef.current) return;
      const place = autoCompleteRef.current.getPlace();
      if (place) {
        onSelect(place);
        setValue(place.formatted_address || '');
      }
    });

    return () => {
      if (autoCompleteRef.current) {
        google.maps.event.clearInstanceListeners(autoCompleteRef.current);
      }
    };
  }, [onSelect]);

  return (
    <Input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}
