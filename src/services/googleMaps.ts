import { Loader } from '@googlemaps/js-api-loader';

let mapsLoader: Loader | null = null;
let loadingPromise: Promise<void> | null = null;

export const initializeGoogleMaps = async (): Promise<void> => {
  if (loadingPromise) {
    return loadingPromise;
  }

  if (!mapsLoader) {
    mapsLoader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
      version: 'weekly',
      libraries: ['places'],
      region: 'SG',
      language: 'en',
    });
  }

  loadingPromise = mapsLoader.load()
    .then(() => {
      window.googleMapsLoaded = true;
    })
    .catch((error) => {
      console.error('Error loading Google Maps:', error);
      loadingPromise = null; // Reset for retry
      throw error;
    });

  return loadingPromise;
};
