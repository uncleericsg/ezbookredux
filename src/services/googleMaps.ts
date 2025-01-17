/// <reference types="@types/google.maps" />

import { Loader } from '@googlemaps/js-api-loader';
import { logger } from '@/lib/logger';
import type { ErrorMetadata } from '@/types/error';

let loadingPromise: Promise<typeof google> | null = null;

export async function initGoogleMaps(apiKey: string): Promise<typeof google> {
  if (loadingPromise) {
    return loadingPromise;
  }

  const loader = new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'geometry']
  });

  loadingPromise = loader.load()
    .then(() => {
      logger.info('Google Maps API loaded successfully');
      return google;
    })
    .catch((error: Error) => {
      logger.error('Failed to load Google Maps API', {
        message: error.message,
        details: error.stack
      } as ErrorMetadata);
      loadingPromise = null;
      throw error;
    });

  return loadingPromise;
}

export function getGoogleMaps(): typeof google | null {
  return window.google || null;
}
