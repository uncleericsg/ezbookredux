declare module '@googlemaps/google-maps-services-js' {
  export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  export interface GeocodeResult {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {
          lat: number;
          lng: number;
        };
        southwest: {
          lat: number;
          lng: number;
        };
      };
    };
    place_id: string;
    types: string[];
  }

  export interface GeocodeResponse {
    data: {
      results: GeocodeResult[];
      status: string;
    };
  }

  export interface DistanceMatrixResponse {
    data: {
      rows: Array<{
        elements: Array<{
          distance?: {
            text: string;
            value: number;
          };
          duration?: {
            text: string;
            value: number;
          };
          status: string;
        }>;
      }>;
      status: string;
    };
  }

  export interface PlaceDetailsResponse {
    data: {
      result: {
        place_id: string;
        name: string;
        formatted_address: string;
        formatted_phone_number?: string;
        rating?: number;
        geometry: {
          location: {
            lat: number;
            lng: number;
          };
        };
        types?: string[];
        website?: string;
        opening_hours?: {
          periods: Array<{
            open: { day: number; time: string };
            close: { day: number; time: string };
          }>;
          weekday_text: string[];
        };
        photos?: Array<{
          photo_reference: string;
          width: number;
          height: number;
        }>;
      };
      status: string;
    };
  }

  export interface PlacesNearbyResponse {
    data: {
      results: Array<{
        place_id: string;
        name: string;
        vicinity: string;
        rating?: number;
        geometry: {
          location: {
            lat: number;
            lng: number;
          };
        };
        types?: string[];
      }>;
      status: string;
    };
  }

  export class Client {
    constructor(options?: Record<string, unknown>);
    geocode(params: {
      params: {
        address: string;
        key: string;
      };
    }): Promise<GeocodeResponse>;
    distancematrix(params: {
      params: {
        origins: Array<{ lat: number; lng: number }>;
        destinations: Array<{ lat: number; lng: number }>;
        key: string;
      };
    }): Promise<DistanceMatrixResponse>;
    placeDetails(params: {
      params: {
        place_id: string;
        key: string;
      };
    }): Promise<PlaceDetailsResponse>;
    placesNearby(params: {
      params: {
        location: { lat: number; lng: number };
        radius: number;
        type?: string;
        keyword?: string;
        key: string;
      };
    }): Promise<PlacesNearbyResponse>;
  }
}
