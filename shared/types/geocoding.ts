/**
 * Types for geocoding functionality
 * Based on Google Maps Geocoding API response structure
 */

export type GeocodeStatus = 
  | 'OK'
  | 'ZERO_RESULTS'
  | 'OVER_DAILY_LIMIT'
  | 'OVER_QUERY_LIMIT'
  | 'REQUEST_DENIED'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: LatLng;
  southwest: LatLng;
}

export interface Geometry {
  location: LatLng;
  location_type: 'ROOFTOP' | 'RANGE_INTERPOLATED' | 'GEOMETRIC_CENTER' | 'APPROXIMATE';
  viewport: Viewport;
}

export interface GeocodeResult {
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
  postal_code?: string;
  street_address?: string;
  subpremise?: string;
}

export interface GeocodeResponse {
  results: GeocodeResult[];
  status: GeocodeStatus;
  error_message?: string;
}

export interface GeocodingError {
  code: 'VALIDATION_ERROR' | 'SERVICE_ERROR' | 'API_ERROR';
  message: string;
  details?: {
    status?: GeocodeStatus;
    error_message?: string;
  };
}

export interface GeocodeApiResponse {
  data?: GeocodeResult[];
  meta?: {
    total: number;
    status: GeocodeStatus;
  };
  error?: GeocodingError;
} 