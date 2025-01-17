import { createApiError } from '@server/utils/apiResponse';
import { logger } from '@server/utils/logger';
import { Client } from '@googlemaps/google-maps-services-js';

interface PlaceDetails {
	placeId: string;
	name: string;
	address: string;
	phoneNumber?: string;
	rating?: number;
	location: {
		lat: number;
		lng: number;
	};
}

interface SearchNearbyParams {
	location: {
		lat: number;
		lng: number;
	};
	radius: number;
	type?: string;
	keyword?: string;
}

export class GooglePlacesService {
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
			const response = await this.client.placeDetails({
				params: {
					place_id: placeId,
					key: this.apiKey
				}
			});

			const place = response.data.result;
			if (!place) {
				throw createApiError('Place not found', 'NOT_FOUND');
			}

			return {
				placeId: place.place_id,
				name: place.name,
				address: place.formatted_address,
				phoneNumber: place.formatted_phone_number,
				rating: place.rating,
				location: {
					lat: place.geometry.location.lat,
					lng: place.geometry.location.lng
				}
			};
		} catch (error) {
			logger.error('Place details error:', error);
			throw createApiError('Failed to fetch place details', 'SERVER_ERROR');
		}
	}

	async searchNearbyPlaces(params: SearchNearbyParams): Promise<PlaceDetails[]> {
		try {
			const response = await this.client.placesNearby({
				params: {
					location: params.location,
					radius: params.radius,
					type: params.type,
					keyword: params.keyword,
					key: this.apiKey
				}
			});

			return response.data.results.map(place => ({
				placeId: place.place_id,
				name: place.name,
				address: place.vicinity,
				rating: place.rating,
				location: {
					lat: place.geometry.location.lat,
					lng: place.geometry.location.lng
				}
			}));
		} catch (error) {
			logger.error('Nearby search error:', error);
			throw createApiError('Failed to search nearby places', 'SERVER_ERROR');
		}
	}
}

export const googlePlacesService = new GooglePlacesService();