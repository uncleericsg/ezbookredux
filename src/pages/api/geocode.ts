import { ApiError } from '../../utils/errors';
import type { ApiResponse } from '../../types/api';

interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = new URL(req.url);
  const postalCode = url.searchParams.get('postalCode');

  if (!postalCode) {
    return new Response(JSON.stringify({ error: 'Postal code is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;
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
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (data.status !== 'OK') {
      throw new ApiError('Google Maps API error', 'SERVICE_ERROR');
    }

    const apiResponse: ApiResponse<GeocodeResult[]> = {
      data: data.results,
      meta: {
        total: data.results.length
      }
    };

    return new Response(JSON.stringify(apiResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 