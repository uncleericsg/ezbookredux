import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { 
  Client, 
  AddressComponent, 
  PlaceInputType,
  AddressType,
  GeocodingAddressComponentType,
  PlaceAutocompleteType
} from '@googlemaps/google-maps-services-js';
import type {
  GeocodingResult,
  LatLng,
  DistanceResult,
  PlacePrediction,
  PlaceDetails,
  GoogleMapsService as IGoogleMapsService
} from '@shared/types/google';

const ADDRESS_TYPES = {
  STREET_NUMBER: 'street_number' as AddressType,
  ROUTE: 'route' as AddressType,
  LOCALITY: 'locality' as AddressType,
  ADMINISTRATIVE_AREA_1: 'administrative_area_level_1' as AddressType,
  POSTAL_CODE: 'postal_code' as AddressType,
  COUNTRY: 'country' as AddressType
};

const PLACE_TYPES = {
  ADDRESS: 'address' as PlaceAutocompleteType
};

export class GoogleMapsService implements IGoogleMapsService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      logger.error('Google Maps API key not found');
    }
  }

  async geocodeAddress(address: string): Promise<GeocodingResult> {
    try {
      logger.info('Geocoding address', { address });

      const response = await this.client.geocode({
        params: {
          address,
          key: this.apiKey
        }
      });

      if (!response.data.results.length) {
        logger.warn('Address not found', { address });
        throw new ApiError('Address not found', 'NOT_FOUND');
      }

      const result = response.data.results[0];
      const components = this.extractAddressComponents(result.address_components);

      logger.info('Address geocoded successfully', { placeId: result.place_id });

      return {
        address: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        placeId: result.place_id,
        components
      };
    } catch (error) {
      logger.error('Geocoding error', { error, address });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to geocode address', 'INTERNAL_SERVER_ERROR');
    }
  }

  async calculateDistance(origin: LatLng, destination: LatLng): Promise<DistanceResult> {
    try {
      logger.info('Calculating distance', { origin, destination });

      const response = await this.client.distancematrix({
        params: {
          origins: [{ lat: origin.lat, lng: origin.lng }],
          destinations: [{ lat: destination.lat, lng: destination.lng }],
          key: this.apiKey
        }
      });

      const element = response.data.rows[0]?.elements[0];
      if (!element?.distance || !element?.duration) {
        logger.warn('Unable to calculate distance', { origin, destination });
        throw new ApiError('Unable to calculate distance', 'NOT_FOUND');
      }

      logger.info('Distance calculated successfully');

      return {
        distance: {
          value: element.distance.value,
          text: element.distance.text
        },
        duration: {
          value: element.duration.value,
          text: element.duration.text
        },
        status: 'OK'
      };
    } catch (error) {
      logger.error('Distance calculation error', { error, origin, destination });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to calculate distance', 'INTERNAL_SERVER_ERROR');
    }
  }

  async getPlacePredictions(input: string): Promise<PlacePrediction[]> {
    try {
      logger.info('Getting place predictions', { input });

      const response = await this.client.placeAutocomplete({
        params: {
          input,
          key: this.apiKey,
          types: PLACE_TYPES.ADDRESS,
          components: ['country:SG']
        }
      });

      return response.data.predictions.map(prediction => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text,
        types: prediction.types || []
      }));
    } catch (error) {
      logger.error('Place predictions error', { error, input });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get place predictions', 'INTERNAL_SERVER_ERROR');
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      logger.info('Getting place details', { placeId });

      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'name',
            'formatted_address',
            'geometry',
            'address_components',
            'types',
            'url',
            'website',
            'formatted_phone_number',
            'rating',
            'user_ratings_total',
            'opening_hours'
          ]
        }
      });

      const result = response.data.result;
      if (!result.geometry?.location) {
        throw new ApiError('Invalid place details response', 'INTERNAL_SERVER_ERROR');
      }

      const components = this.extractAddressComponents(result.address_components || []);

      return {
        placeId: placeId,
        name: result.name || '',
        formattedAddress: result.formatted_address || '',
        location: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        },
        addressComponents: components,
        types: result.types || [],
        url: result.url,
        website: result.website,
        phoneNumber: result.formatted_phone_number,
        rating: result.rating,
        userRatingsTotal: result.user_ratings_total,
        openingHours: result.opening_hours ? {
          isOpenNow: result.opening_hours.open_now || false,
          weekdayText: result.opening_hours.weekday_text || []
        } : undefined
      };
    } catch (error) {
      logger.error('Place details error', { error, placeId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to get place details', 'INTERNAL_SERVER_ERROR');
    }
  }

  private extractAddressComponents(components: AddressComponent[]) {
    const result: GeocodingResult['components'] = {};

    components.forEach(component => {
      const value = component.long_name;

      if (component.types.includes(ADDRESS_TYPES.STREET_NUMBER)) {
        result.streetNumber = value;
      } else if (component.types.includes(ADDRESS_TYPES.ROUTE)) {
        result.route = value;
      } else if (component.types.includes(ADDRESS_TYPES.LOCALITY)) {
        result.locality = value;
      } else if (component.types.includes(ADDRESS_TYPES.ADMINISTRATIVE_AREA_1)) {
        result.area = value;
      } else if (component.types.includes(ADDRESS_TYPES.POSTAL_CODE)) {
        result.postalCode = value;
      } else if (component.types.includes(ADDRESS_TYPES.COUNTRY)) {
        result.country = value;
      }
    });

    return result;
  }
}

export const googleMapsService = new GoogleMapsService();
