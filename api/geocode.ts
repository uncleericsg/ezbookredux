import type { NextApiRequest, NextApiResponse } from 'next';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

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

interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
  meta?: {
    total: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GeocodeResult[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED'
      }
    });
  }

  const { postalCode } = req.query;

  if (!postalCode || Array.isArray(postalCode)) {
    return res.status(400).json({
      error: {
        message: 'Postal code is required and must be a string',
        code: 'INVALID_PARAMETER'
      }
    });
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
      resultsCount: data.results.length
    });

    return res.status(200).json({
      data: data.results,
      meta: {
        total: data.results.length
      }
    });
  } catch (error) {
    logger.error('Geocoding failed', { error, postalCode });

    if (error instanceof ApiError) {
      return res.status(500).json({
        error: {
          message: error.message,
          code: error.code
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
} 