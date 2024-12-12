import { Loader } from '@googlemaps/js-api-loader';

export class GooglePlacesService {
  private static instance: GooglePlacesService;
  private static loader: Loader | null = null;
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private dummyDiv: HTMLDivElement | null = null;

  private static retryDelay = 1000; // 1 second delay between retries
  private static maxRetries = 3;

  private constructor() {}

  public static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  private static getLoader(): Loader {
    if (!GooglePlacesService.loader) {
      const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      if (!apiKey?.trim()) {
        throw new Error('Google Places API key is not configured in environment variables');
      }

      GooglePlacesService.loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places'],
        retries: 3
      });
    }
    return GooglePlacesService.loader;
  }

  private async loadGoogleMapsScript(): Promise<void> {
    try {
      const loader = GooglePlacesService.getLoader();
      await loader.load();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('rate limit')) {
          throw new Error('Google Places API rate limit exceeded. Please try again in a few minutes.');
        }
        if (error.message.includes('InvalidKeyMapError') || error.message.includes('RefererNotAllowedMapError')) {
          throw new Error('Invalid Google Places API key or unauthorized domain. Please check your configuration.');
        }
      }
      throw new Error('Failed to load Google Maps API. Please check your internet connection and try again.');
    }
  }

  private createDummyElement(): void {
    if (!this.dummyDiv) {
      this.dummyDiv = document.createElement('div');
      this.dummyDiv.style.display = 'none';
      this.dummyDiv.id = 'google-maps-dummy';
      document.body.appendChild(this.dummyDiv);
    }
  }

  private cleanup(): void {
    if (this.dummyDiv) {
      this.dummyDiv.remove();
      this.dummyDiv = null;
    }
    this.autocompleteService = null;
    this.placesService = null;
    this.geocoder = null;
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = (async () => {
      try {
        await this.loadGoogleMapsScript();
        
        if (!window.google?.maps) {
          throw new Error('Google Maps failed to load properly');
        }

        this.createDummyElement();

        if (!this.dummyDiv) {
          throw new Error('Failed to create Maps service element');
        }

        // Initialize services
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.geocoder = new google.maps.Geocoder();
        this.placesService = new google.maps.places.PlacesService(this.dummyDiv);

        if (!this.autocompleteService || !this.geocoder || !this.placesService) {
          throw new Error('Failed to initialize Google Places services');
        }

        this.isInitialized = true;
      } catch (error) {
        this.cleanup();
        throw error;
      }
    })();

    return this.initializationPromise;
  }

  private async retryOperation<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;
    for (let attempt = 1; attempt <= GooglePlacesService.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (this.isRateLimitError(lastError)) {
          if (attempt < GooglePlacesService.maxRetries) {
            await new Promise(resolve => 
              setTimeout(resolve, GooglePlacesService.retryDelay * attempt)
            );
            continue;
          }
        }
        throw lastError;
      }
    }
    throw lastError!;
  }

  private isRateLimitError(error: Error): boolean {
    return error.message.toLowerCase().includes('rate limit') ||
           error.message.includes('OVER_QUERY_LIMIT') ||
           error.message.includes('quota');
  }

  public async searchAddress(input: string): Promise<google.maps.places.AutocompletePrediction[]> {
    if (!this.isInitialized || !this.autocompleteService) {
      throw new Error('Google Places service is not initialized');
    }

    try {
      const response = await this.autocompleteService.getPlacePredictions({
        input,
        componentRestrictions: { country: 'SG' },
        types: ['address']
      });
      return response.predictions || [];
    } catch (error) {
      if (error instanceof Error && this.isRateLimitError(error)) {
        throw new Error('RATE_LIMIT_ERROR');
      }
      throw new Error('Failed to fetch address suggestions');
    }
  }

  public async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    if (!this.isInitialized || !this.placesService) {
      throw new Error('Google Places service is not initialized');
    }

    return new Promise((resolve, reject) => {
      this.placesService!.getDetails(
        { placeId, fields: ['formatted_address', 'geometry', 'address_components'] },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            resolve(result);
          } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            reject(new Error('RATE_LIMIT_ERROR'));
          } else {
            reject(new Error('Failed to fetch place details'));
          }
        }
      );
    });
  }

  public async getPostalCodeFromAddress(address: string): Promise<string | null> {
    if (!this.isInitialized || !this.geocoder) {
      throw new Error('Google Places service is not initialized');
    }

    try {
      const response = await this.geocoder.geocode({ address });
      if (response.results[0]) {
        const postalCodeComponent = response.results[0].address_components.find(
          component => component.types.includes('postal_code')
        );
        return postalCodeComponent?.long_name || null;
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch postal code');
    }
  }
}
