import * as React from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from './Input';
import { cn } from '../../utils/cn';

const libraries: ("places")[] = ["places"];

export interface AddressAutocompleteProps extends React.HTMLAttributes<HTMLDivElement> {
  apiKey: string;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  error?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

const AddressAutocomplete = React.forwardRef<HTMLDivElement, AddressAutocompleteProps>(
  ({ className, apiKey, onPlaceSelect, placeholder = 'Enter address', error, value, onChange, ...props }, ref) => {
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: apiKey,
      libraries,
    });

    const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
      setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
      if (autocomplete) {
        const place = autocomplete.getPlace();
        onPlaceSelect?.(place);
        onChange?.(place.formatted_address || '');
      }
    };

    if (loadError) {
      return <div>Error loading Google Maps</div>;
    }

    if (!isLoaded) {
      return <div>Loading...</div>;
    }

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <Input
            type="text"
            placeholder={placeholder}
            error={error}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full"
          />
        </Autocomplete>
      </div>
    );
  }
);
AddressAutocomplete.displayName = 'AddressAutocomplete';

export { AddressAutocomplete };
