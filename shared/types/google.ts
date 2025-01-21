/**
 * Google Maps service types
 */

/**
 * Latitude and longitude coordinates
 */
export interface LatLng {
  /**
   * Latitude
   */
  lat: number;

  /**
   * Longitude
   */
  lng: number;
}

/**
 * Distance value with text representation
 */
export interface Distance {
  /**
   * Distance in meters
   */
  value: number;

  /**
   * Human-readable distance (e.g., "5.2 km")
   */
  text: string;
}

/**
 * Duration value with text representation
 */
export interface Duration {
  /**
   * Duration in seconds
   */
  value: number;

  /**
   * Human-readable duration (e.g., "10 mins")
   */
  text: string;
}

/**
 * Distance calculation result
 */
export interface DistanceResult {
  /**
   * Distance information
   */
  distance: Distance;

  /**
   * Duration information
   */
  duration: Duration;

  /**
   * Status of the calculation
   */
  status: 'OK' | 'NOT_FOUND' | 'ZERO_RESULTS' | 'MAX_ROUTE_LENGTH_EXCEEDED' | 'ERROR';
}

/**
 * Address components from geocoding result
 */
export interface AddressComponents {
  /**
   * Street number
   */
  streetNumber?: string;

  /**
   * Street name
   */
  route?: string;

  /**
   * City/locality
   */
  locality?: string;

  /**
   * State/administrative area
   */
  area?: string;

  /**
   * Postal code
   */
  postalCode?: string;

  /**
   * Country
   */
  country?: string;
}

/**
 * Geocoding result
 */
export interface GeocodingResult {
  /**
   * Formatted address
   */
  address: string;

  /**
   * Latitude
   */
  latitude: number;

  /**
   * Longitude
   */
  longitude: number;

  /**
   * Google Place ID
   */
  placeId: string;

  /**
   * Address components
   */
  components: AddressComponents;
}

/**
 * Place prediction for autocomplete
 */
export interface PlacePrediction {
  /**
   * Place ID
   */
  placeId: string;

  /**
   * Description (formatted address)
   */
  description: string;

  /**
   * Main text
   */
  mainText: string;

  /**
   * Secondary text
   */
  secondaryText: string;

  /**
   * Types of the place
   */
  types: string[];
}

/**
 * Place details
 */
export interface PlaceDetails {
  /**
   * Place ID
   */
  placeId: string;

  /**
   * Name
   */
  name: string;

  /**
   * Formatted address
   */
  formattedAddress: string;

  /**
   * Location
   */
  location: LatLng;

  /**
   * Address components
   */
  addressComponents: AddressComponents;

  /**
   * Types of the place
   */
  types: string[];

  /**
   * URL
   */
  url?: string;

  /**
   * Website
   */
  website?: string;

  /**
   * Phone number
   */
  phoneNumber?: string;

  /**
   * Rating
   */
  rating?: number;

  /**
   * User ratings total
   */
  userRatingsTotal?: number;

  /**
   * Opening hours
   */
  openingHours?: {
    /**
     * Is open now
     */
    isOpenNow: boolean;

    /**
     * Weekday text
     */
    weekdayText: string[];
  };
}

/**
 * Google Maps service interface
 */
export interface GoogleMapsService {
  /**
   * Geocode an address to get coordinates and place details
   */
  geocodeAddress(address: string): Promise<GeocodingResult>;

  /**
   * Calculate distance and duration between two points
   */
  calculateDistance(origin: LatLng, destination: LatLng): Promise<DistanceResult>;

  /**
   * Get place predictions for autocomplete
   */
  getPlacePredictions?(input: string): Promise<PlacePrediction[]>;

  /**
   * Get place details
   */
  getPlaceDetails?(placeId: string): Promise<PlaceDetails>;
}
