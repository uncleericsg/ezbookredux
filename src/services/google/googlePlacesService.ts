/// <reference types="@types/google.maps" />

import { logger } from '@/lib/logger';
import type { ErrorMetadata } from '@/types/error';
import { initGoogleMaps } from '../googleMaps';

export interface PlaceDetails {
  placeId: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  postalCode?: string;
}

export async function searchPlaces(
  query: string,
  apiKey: string
): Promise<google.maps.places.AutocompletePrediction[]> {
  try {
    const google = await initGoogleMaps(apiKey);
    const service = new google.maps.places.AutocompleteService();

    const request: google.maps.places.AutocompletionRequest = {
      input: query,
      componentRestrictions: { country: 'SG' },
      types: ['address']
    };

    return new Promise((resolve) => {
      service.getPlacePredictions(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          logger.warn('Places search returned no results', {
            status,
            query
          } as ErrorMetadata);
          resolve([]);
        }
      });
    });
  } catch (error) {
    logger.error('Failed to search places', {
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof Error ? error.stack : undefined
    } as ErrorMetadata);
    return [];
  }
}

export async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceDetails | null> {
  try {
    const google = await initGoogleMaps(apiKey);
    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: ['formatted_address', 'geometry', 'address_components']
    };

    return new Promise((resolve) => {
      service.getDetails(request, (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result) {
          const postalCode = result.address_components?.find(
            component => component.types.includes('postal_code')
          )?.long_name;

          resolve({
            placeId,
            address: result.formatted_address || '',
            location: {
              lat: result.geometry?.location?.lat() || 0,
              lng: result.geometry?.location?.lng() || 0
            },
            postalCode
          });
        } else {
          logger.warn('Place details request failed', {
            status,
            placeId
          } as ErrorMetadata);
          resolve(null);
        }
      });
    });
  } catch (error) {
    logger.error('Failed to get place details', {
      message: error instanceof Error ? error.message : String(error),
      details: error instanceof Error ? error.stack : undefined
    } as ErrorMetadata);
    return null;
  }
}
