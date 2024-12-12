import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Initialize the loader
const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY || 'dummy-key-for-development',
  version: 'weekly',
  libraries: ['places'],
  region: 'SG',
  language: 'en'
});

export interface PlaceDetails {
  postalCode: string;
  streetAddress: string;
  district: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

export const validateAddress = async (address: string) => {
  if (import.meta.env.MODE === 'development') {
    // Return mock validation in development
    return {
      isValid: true,
      formattedAddress: address,
      components: {
        postalCode: '123456',
        streetName: 'Test Street',
        buildingName: 'Test Building',
        district: 'Test District'
      }
    };
  }

  try {
    await loader.load();
    const geocoder = new google.maps.Geocoder();
    
    const response = await geocoder.geocode({
      address: `${address}, Singapore`,
      componentRestrictions: { country: 'SG' }
    });

    if (!response.results.length) {
      return { isValid: false };
    }

    const result = response.results[0];
    const components = result.address_components.reduce((acc, component) => {
      if (component.types.includes('postal_code')) {
        acc.postalCode = component.long_name;
      } else if (component.types.includes('route')) {
        acc.streetName = component.long_name;
      } else if (component.types.includes('sublocality')) {
        acc.district = component.long_name;
      }
      return acc;
    }, {} as any);

    return {
      isValid: true,
      formattedAddress: result.formatted_address,
      components
    };
  } catch (error) {
    console.error('Error validating address:', error);
    return { isValid: false };
  }
};

export const initGooglePlaces = async (): Promise<google.maps.places.AutocompleteService> => {
  if (import.meta.env.MODE === 'development') {
    // Return a mock service in development
    return {
      getPlacePredictions: () => 
        Promise.resolve({
          predictions: [
            {
              place_id: 'test-place-1',
              description: 'Test Location 1, Singapore 123456',
              structured_formatting: {
                main_text: 'Test Location 1',
                secondary_text: 'Singapore 123456'
              }
            },
            {
              place_id: 'test-place-2',
              description: 'Test Location 2, Singapore 234567',
              structured_formatting: {
                main_text: 'Test Location 2',
                secondary_text: 'Singapore 234567'
              }
            }
          ]
        })
    } as any;
  }

  await loader.load();
  return new google.maps.places.AutocompleteService();
};

export const getPlacePredictions = async (
  input: string,
  autocompleteService: google.maps.places.AutocompleteService
): Promise<google.maps.places.AutocompletePrediction[]> => {
  if (import.meta.env.MODE === 'development') {
    return [
      {
        place_id: 'test-place-1',
        description: 'Test Location 1, Singapore 123456',
        structured_formatting: {
          main_text: 'Test Location 1',
          secondary_text: 'Singapore 123456'
        }
      } as google.maps.places.AutocompletePrediction
    ];
  }

  try {
    const response = await autocompleteService.getPlacePredictions({
      input,
      componentRestrictions: { country: 'sg' },
      types: ['address']
    });
    return response.predictions;
  } catch (error) {
    console.error('Error getting place predictions:', error);
    return [];
  }
};

export const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
  if (import.meta.env.MODE === 'development') {
    return {
      postalCode: '123456',
      streetAddress: 'Test Street 123',
      district: 'Test District',
      formattedAddress: 'Test Street 123, Test District, Singapore 123456',
      latitude: 1.3521,
      longitude: 103.8198
    };
  }

  try {
    await loader.load();
    const placesService = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve, reject) => {
      placesService.getDetails(
        {
          placeId,
          fields: ['address_components', 'formatted_address', 'geometry']
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const details: PlaceDetails = {
              postalCode: '',
              streetAddress: '',
              district: '',
              formattedAddress: result.formatted_address || '',
              latitude: result.geometry?.location?.lat() || 0,
              longitude: result.geometry?.location?.lng() || 0
            };

            result.address_components?.forEach((component) => {
              if (component.types.includes('postal_code')) {
                details.postalCode = component.long_name;
              }
              if (component.types.includes('street_number') || component.types.includes('route')) {
                details.streetAddress += component.long_name + ' ';
              }
              if (component.types.includes('sublocality')) {
                details.district = component.long_name;
              }
            });

            resolve(details);
          } else {
            reject(new Error(`Place details request failed: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error getting place details:', error);
    return null;
  }
};
