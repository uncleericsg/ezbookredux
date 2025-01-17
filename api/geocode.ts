import type { NextApiResponse } from 'next';
import { withAuth } from '@/api/shared/middleware';
import { ApiError } from '@/server/utils/apiErrors';
import { logger } from '@/server/utils/logger';
import type { AuthenticatedRequest } from '@/api/shared/types';

interface GeocodeResult {
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

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
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
      throw new ApiError('Google Maps API key is not configured', 'SERVICE_ERROR');
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode},Singapore&key=${apiKey}`
    );

    if (!response.ok) {
      throw new ApiError('Failed to fetch from Google Maps API', 'SERVICE_ERROR');
    }

    const data: GeocodeResponse = await response.json();

    if (data.status === 'ZERO_RESULTS') {
      return res.status(200).json({
        data: [],
        meta: {
          total: 0
        }
      });
    }

    if (data.status !== 'OK') {
      throw new ApiError('Google Maps API error', 'SERVICE_ERROR');
    }

    logger.info('Geocoding successful', {
      postalCode,
      resultsCount: data.results.length,
      userId: req.user.id
    });

    return res.status(200).json({
      data: data.results,
      meta: {
        total: data.results.length
      }
    });
  } catch (error) {
    logger.error('Geocoding failed', { error, postalCode, userId: req.user.id });
    
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
          code: error.code,
          details: error.details
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'SERVER_ERROR'
      }
    });
  }
}

export default withAuth(handler); 