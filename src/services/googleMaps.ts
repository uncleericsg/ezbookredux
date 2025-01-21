/// <reference types="@types/google.maps" />

import { Loader } from '@googlemaps/js-api-loader';
import { logger } from '@/utils/logger';
import { APIError } from '@/utils/apiErrors';
import { config } from '@/config';

let loadingPromise: Promise<typeof google> | null = null;

export function isGoogleMapsLoaded(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
}

export async function initGoogleMaps(): Promise<typeof google> {
  if (loadingPromise) {
    return loadingPromise;
  }

  if (!config.googleMaps.apiKey) {
    throw new APIError(
      'GOOGLE_MAPS_API_KEY_MISSING',
      'Google Maps API key is not configured',
      500
    );
  }

  const loader = new Loader({
    apiKey: config.googleMaps.apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  });

  loadingPromise = loader.load()
    .then(() => {
      logger.info('Google Maps API loaded successfully');
      return google;
    })
    .catch((error: Error) => {
      logger.error('Failed to load Google Maps API', {
        code: 'GOOGLE_MAPS_LOAD_ERROR',
        message: error.message,
        details: error.stack
      });
      loadingPromise = null;
      throw new APIError(
        'GOOGLE_MAPS_LOAD_ERROR',
        'Failed to load Google Maps API',
        500,
        { originalError: error }
      );
    });

  return loadingPromise;
}

export interface GoogleMapsConfig {
  apiKey: string;
  region?: string;
  language?: string;
  libraries?: Array<'places' | 'geometry' | 'drawing' | 'visualization'>;
}

export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  postalCode?: string;
  location?: {
    lat: number;
    lng: number;
  };
  components: {
    streetNumber?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export function mapPrediction(
  prediction: google.maps.places.AutocompletePrediction
): PlacePrediction {
  return {
    placeId: prediction.place_id,
    description: prediction.description,
    mainText: prediction.structured_formatting.main_text,
    secondaryText: prediction.structured_formatting.secondary_text,
    types: prediction.types
  };
}

export function mapPlaceResult(
  result: google.maps.places.PlaceResult
): PlaceDetails {
  const components = {
    streetNumber: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  };

  result.address_components?.forEach(component => {
    if (component.types.includes('street_number')) {
      components.streetNumber = component.long_name;
    }
    if (component.types.includes('route')) {
      components.street = component.long_name;
    }
    if (component.types.includes('locality')) {
      components.city = component.long_name;
    }
    if (component.types.includes('administrative_area_level_1')) {
      components.state = component.long_name;
    }
    if (component.types.includes('country')) {
      components.country = component.long_name;
    }
    if (component.types.includes('postal_code')) {
      components.postalCode = component.long_name;
    }
  });

  return {
    placeId: result.place_id || '',
    formattedAddress: result.formatted_address || '',
    postalCode: components.postalCode,
    location: result.geometry?.location ? {
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng()
    } : undefined,
    components
  };
}
