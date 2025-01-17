/// <reference types="@types/google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps {
  interface PlacesService {
    findPlaceFromQuery(
      request: FindPlaceFromQueryRequest,
      callback: (results: PlaceResult[] | null, status: PlacesServiceStatus) => void
    ): void;
    
    getDetails(
      request: PlaceDetailsRequest,
      callback: (result: PlaceResult | null, status: PlacesServiceStatus) => void
    ): void;
  }

  interface Geocoder {
    geocode(
      request: GeocoderRequest,
      callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void
    ): void;
  }

  interface GeocoderResult {
    formatted_address: string;
    address_components: AddressComponent[];
    geometry: {
      location: LatLng;
      location_type: string;
      viewport: {
        northeast: LatLng;
        southwest: LatLng;
      };
    };
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  interface AutocompleteService {
    getPlacePredictions(
      request: AutocompletionRequest,
      callback: (predictions: AutocompletePrediction[] | null, status: PlacesServiceStatus) => void
    ): void;
  }

  interface AutocompletePrediction {
    place_id: string;
    description: string;
  }

  interface PlaceResult {
    place_id: string;
    formatted_address: string;
    address_components?: AddressComponent[];
    geometry: {
      location: LatLng;
      viewport: {
        northeast: LatLng;
        southwest: LatLng;
      };
    };
  }

  enum PlacesServiceStatus {
    OK = 'OK',
    ZERO_RESULTS = 'ZERO_RESULTS',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    INVALID_REQUEST = 'INVALID_REQUEST'
  }

  enum GeocoderStatus {
    OK = 'OK',
    ZERO_RESULTS = 'ZERO_RESULTS',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    INVALID_REQUEST = 'INVALID_REQUEST'
  }

  interface FindPlaceFromQueryRequest {
    query: string;
    fields: string[];
  }

  interface PlaceDetailsRequest {
    placeId: string;
    fields: string[];
  }

  interface GeocoderRequest {
    address?: string;
    location?: LatLng;
    bounds?: LatLngBounds;
    componentRestrictions?: GeocoderComponentRestrictions;
    region?: string;
  }

  interface GeocoderComponentRestrictions {
    country: string | string[];
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface LatLngBounds {
    northeast: LatLng;
    southwest: LatLng;
  }

  interface AutocompletionRequest {
    input: string;
    types?: string[];
    componentRestrictions?: GeocoderComponentRestrictions;
    bounds?: LatLngBounds;
    location?: LatLng;
    radius?: number;
    sessionToken?: AutocompleteSessionToken;
  }

  class AutocompleteSessionToken {}
}

export {}; 