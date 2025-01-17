import { handleNotFoundError, handleValidationError } from '@/utils/apiErrors';
import { logger } from '@/lib/logger';

export async function getPostalCode(address: string): Promise<string | null> {
  if (!address) {
    handleValidationError('Address is required');
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ address });
    
    if (!response.results.length) {
      return null;
    }

    const postalComponent = response.results[0].address_components.find(
      component => component.types.includes('postal_code')
    );

    return postalComponent?.long_name || null;
  } catch (error) {
    logger.error('Failed to get postal code', {
      message: error instanceof Error ? error.message : String(error),
      address
    });
    throw error;
  }
}

export async function getFormattedAddress(address: string): Promise<string | null> {
  if (!address) {
    handleValidationError('Address is required');
  }

  try {
    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ address });
    
    if (!response.results.length) {
      return null;
    }

    return response.results[0].formatted_address;
  } catch (error) {
    logger.error('Failed to get formatted address', {
      message: error instanceof Error ? error.message : String(error),
      address
    });
    throw error;
  }
}

export async function getPlacePredictions(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
  if (!input) {
    handleValidationError('Input is required for place predictions');
  }

  try {
    const service = new google.maps.places.AutocompleteService();
    const response = await service.getPlacePredictions({ input });
    return response.predictions;
  } catch (error) {
    logger.error('Failed to get place predictions', {
      message: error instanceof Error ? error.message : String(error),
      input
    });
    throw error;
  }
}

export async function getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
  if (!placeId) {
    handleValidationError('Place ID is required');
  }

  try {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const response = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
      service.getDetails({ placeId }, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Failed to get place details: ${status}`));
        }
      });
    });

    return response;
  } catch (error) {
    logger.error('Failed to get place details', {
      message: error instanceof Error ? error.message : String(error),
      placeId
    });
    throw error;
  }
}

