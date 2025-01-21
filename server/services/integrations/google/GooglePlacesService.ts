import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { Client, PlaceDetailsResponse, PlacesNearbyResponse } from '@googlemaps/google-maps-services-js';
import type {
  PlaceDetails,
  SearchNearbyParams,
  GooglePlacesService as IGooglePlacesService
} from '@shared/types/google';

type PlacePhoto = NonNullable<PlaceDetailsResponse['data']['result']['photos']>[0];
type NearbyPlace = PlacesNearbyResponse['data']['results'][0];
type PlaceResult = PlaceDetailsResponse['data']['result'];

export class GooglePlacesService implements IGooglePlacesService {
  private client: Client;
  private apiKey: string;

  constructor() {
    this.client = new Client({});
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      logger.error('Google Maps API key not found');
    }
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      logger.info('Fetching place details', { placeId });

      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey
        }
      });

      const place = response.data.result;
      if (!place) {
        logger.warn('Place not found', { placeId });
        throw new ApiError('Place not found', 'NOT_FOUND');
      }

      logger.info('Place details fetched successfully', { placeId });

      return this.mapPlaceDetails(place);
    } catch (error) {
      logger.error('Place details error', { error, placeId });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch place details', 'INTERNAL_SERVER_ERROR');
    }
  }

  async searchNearbyPlaces(params: SearchNearbyParams): Promise<PlaceDetails[]> {
    try {
      logger.info('Searching nearby places', { params });

      const response = await this.client.placesNearby({
        params: {
          location: params.location,
          radius: params.radius,
          type: params.type,
          keyword: params.keyword,
          key: this.apiKey
        }
      });

      logger.info('Nearby places search successful', { 
        count: response.data.results.length 
      });

      return response.data.results.map((place: NearbyPlace) => this.mapNearbyPlace(place));
    } catch (error) {
      logger.error('Nearby search error', { error, params });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to search nearby places', 'INTERNAL_SERVER_ERROR');
    }
  }

  private mapPlaceDetails(place: PlaceResult): PlaceDetails {
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      phoneNumber: place.formatted_phone_number,
      rating: place.rating,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      types: place.types,
      website: place.website,
      openingHours: place.opening_hours ? {
        periods: place.opening_hours.periods,
        weekdayText: place.opening_hours.weekday_text
      } : undefined,
      photos: place.photos?.map((photo: PlacePhoto) => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height
      }))
    };
  }

  private mapNearbyPlace(place: NearbyPlace): PlaceDetails {
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity,
      rating: place.rating,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      types: place.types
    };
  }
}

export const googlePlacesService = new GooglePlacesService();
