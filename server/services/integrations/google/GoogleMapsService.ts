import { createApiError } from '@server/utils/apiResponse';
import { logger } from '@server/utils/logger';
import { Client, GeocodeResponse } from '@googlemaps/google-maps-services-js';

interface GeocodingResult {
	address: string;
	latitude: number;
	longitude: number;
	placeId: string;
}

export class GoogleMapsService {
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
			const response = await this.client.geocode({
				params: {
					address,
					key: this.apiKey
				}
			});

			if (!response.data.results.length) {
				throw createApiError('Address not found', 'NOT_FOUND');
			}

			const result = response.data.results[0];
			return {
				address: result.formatted_address,
				latitude: result.geometry.location.lat,
				longitude: result.geometry.location.lng,
				placeId: result.place_id
			};
		} catch (error) {
			logger.error('Geocoding error:', error);
			throw createApiError('Failed to geocode address', 'SERVER_ERROR');
		}
	}

	async calculateDistance(
		origin: { lat: number; lng: number },
		destination: { lat: number; lng: number }
	): Promise<number> {
		try {
			const response = await this.client.distancematrix({
				params: {
					origins: [{ lat: origin.lat, lng: origin.lng }],
					destinations: [{ lat: destination.lat, lng: destination.lng }],
					key: this.apiKey
				}
			});

			if (!response.data.rows[0]?.elements[0]?.distance) {
				throw createApiError('Unable to calculate distance', 'SERVER_ERROR');
			}

			return response.data.rows[0].elements[0].distance.value;
		} catch (error) {
			logger.error('Distance calculation error:', error);
			throw createApiError('Failed to calculate distance', 'SERVER_ERROR');
		}
	}
}

export const googleMapsService = new GoogleMapsService();