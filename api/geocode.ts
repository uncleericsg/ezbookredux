import type { NextApiResponse } from 'next';
import { withAuth } from '@server/api/middleware/auth';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { AuthenticatedRequest } from '@server/types/api';
import { 
  GeocodeResponse, 
  GeocodeApiResponse,
  GeocodeStatus,
  GeocodingError
} from '@shared/types/geocoding';

/**
 * Geocode a postal code to get location details
 * GET /api/geocode?postalCode=123456
 * Requires authentication
 */
async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<GeocodeApiResponse>
) {
  if (req.method !== 'GET') {
    throw new ApiError('Method not allowed', 'METHOD_NOT_ALLOWED');
  }

  const { postalCode } = req.query;

  if (!postalCode || Array.isArray(postalCode)) {
    throw new ApiError('Postal code is required and must be a string', 'VALIDATION_ERROR');
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      logger.error('Google Maps API key is not configured');
      throw new ApiError('Service configuration error', 'SERVICE_ERROR');
    }

    // Validate postal code format
    const postalCodeRegex = /^\d{6}$/;
    if (!postalCodeRegex.test(postalCode)) {
      throw new ApiError('Invalid postal code format. Must be 6 digits.', 'VALIDATION_ERROR');
    }

    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.append('address', `${postalCode},Singapore`);
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());

    if (!response.ok) {
      logger.error('Google Maps API request failed', {
        status: response.status,
        statusText: response.statusText
      });
      throw new ApiError('Failed to fetch from Google Maps API', 'SERVICE_ERROR');
    }

    const data: GeocodeResponse = await response.json();

    // Handle various Google Maps API status codes
    switch (data.status) {
      case 'OK':
        logger.info('Geocoding successful', {
          postalCode,
          resultsCount: data.results.length,
          userId: req.user.id
        });
        return res.status(200).json({
          data: data.results,
          meta: {
            total: data.results.length,
            status: data.status
          }
        });

      case 'ZERO_RESULTS':
        logger.info('No results found for postal code', { postalCode });
        return res.status(200).json({
          data: [],
          meta: {
            total: 0,
            status: data.status
          }
        });

      case 'OVER_DAILY_LIMIT':
      case 'OVER_QUERY_LIMIT':
        logger.error('Google Maps API quota exceeded', { status: data.status });
        throw new ApiError('Service quota exceeded', 'SERVICE_ERROR');

      case 'REQUEST_DENIED':
        logger.error('Google Maps API request denied', { 
          status: data.status,
          error: data.error_message 
        });
        throw new ApiError('Service authentication failed', 'SERVICE_ERROR');

      case 'INVALID_REQUEST':
        logger.error('Invalid request to Google Maps API', { 
          status: data.status,
          error: data.error_message 
        });
        throw new ApiError('Invalid geocoding request', 'SERVICE_ERROR');

      default:
        logger.error('Unknown Google Maps API error', { 
          status: data.status,
          error: data.error_message 
        });
        throw new ApiError('Service error', 'SERVICE_ERROR');
    }

  } catch (error) {
    logger.error('Geocoding failed', { 
      error,
      postalCode,
      userId: req.user.id 
    });
    
    if (error instanceof ApiError) {
      const geocodingError: GeocodingError = {
        code: error.code as GeocodingError['code'],
        message: error.message,
        details: error.details
      };

      return res.status(error.statusCode || 400).json({
        error: geocodingError
      });
    }

    return res.status(500).json({
      error: {
        code: 'SERVICE_ERROR',
        message: 'Internal server error'
      }
    });
  }
}

export default withAuth(handler); 