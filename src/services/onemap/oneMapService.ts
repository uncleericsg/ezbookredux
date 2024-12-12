import { oneMapConfig, OneMapSearchResponse, isOneMapError } from '../../config/oneMapConfig';
import { RateLimitError, NetworkError } from '../../types/errors';
import { NetworkUtils } from '../../utils/networkUtils';
import { OneMapTokenService } from './oneMapTokenService';

export class OneMapService {
  private static instance: OneMapService;
  private requestCount: number = 0;
  private lastRequestTime: number = Date.now();
  private tokenService: OneMapTokenService;

  private constructor() {
    this.tokenService = OneMapTokenService.getInstance();
    // Initialize token service
    this.tokenService.initialize().catch(error => {
      console.error('Failed to initialize OneMap token service:', error);
    });
  }

  static getInstance(): OneMapService {
    if (!OneMapService.instance) {
      OneMapService.instance = new OneMapService();
    }
    return OneMapService.instance;
  }

  private checkRateLimit() {
    const now = Date.now();
    if (now - this.lastRequestTime >= oneMapConfig.RATE_LIMIT.WINDOW_MS) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= oneMapConfig.RATE_LIMIT.MAX_REQUESTS) {
      throw new RateLimitError('OneMap API rate limit exceeded');
    }

    this.requestCount++;
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = 15000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      // Get a fresh token for each request
      const token = await this.tokenService.getToken();
      console.log('Using OneMap token for request');

      if (!navigator.onLine) {
        throw new NetworkError('No internet connection');
      }

      console.log('OneMap API Request:', url);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      clearTimeout(id);
      
      console.log('OneMap API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OneMap API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 0) {
          throw new NetworkError('Network error - Unable to reach the OneMap API');
        }
        
        if (response.status === 401) {
          console.log('Token expired, refreshing...');
          // Token might be invalid, try to get a new one
          await this.tokenService.getToken();
          throw new NetworkError('Authentication failed - Retrying with new token');
        }
        
        throw new NetworkError(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(id);
      console.error('OneMap API Fetch Error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout - Please check your internet connection');
        }
        if (error.name === 'TypeError') {
          if (error.message.includes('Failed to fetch')) {
            throw new NetworkError('Network error - Please check your internet connection');
          }
          if (error.message.includes('NetworkError')) {
            throw new NetworkError('Network error - Unable to reach the OneMap API. Please check your internet connection or try again later.');
          }
        }
        throw error;
      }
      throw new NetworkError('An unexpected error occurred while connecting to OneMap API');
    }
  }

  async searchByPostalCode(postalCode: string): Promise<OneMapSearchResponse> {
    return NetworkUtils.withRetry(async () => {
      try {
        this.checkRateLimit();
        
        // Use the proxy endpoint
        const url = new URL('/onemap/commonapi/search', window.location.origin);
        url.searchParams.append('searchVal', postalCode);
        url.searchParams.append('returnGeom', 'Y');
        url.searchParams.append('getAddrDetails', 'Y');
        
        console.log('Searching OneMap with postal code:', postalCode);
        console.log('Full URL:', url.toString());
        
        const response = await this.fetchWithTimeout(url.toString());
        const data = await response.json();

        if (isOneMapError(data)) {
          console.error('OneMap API Response Error:', data);
          throw new Error(data.message || 'Error searching postal code');
        }

        return data;
      } catch (error) {
        console.error('OneMap searchByPostalCode Error:', error);
        if (error instanceof NetworkError || NetworkUtils.isNetworkError(error)) {
          throw new NetworkError('Network connectivity issue - Please check your internet connection');
        }
        if (error instanceof Error) {
          throw new NetworkError(error.message);
        }
        throw new NetworkError('Failed to search postal code');
      }
    });
  }

  async reverseGeocode(latitude: number, longitude: number) {
    try {
      const url = new URL('/onemap/commonapi/reverse-geocode', window.location.origin);
      url.searchParams.append('latitude', latitude.toString());
      url.searchParams.append('longitude', longitude.toString());

      const response = await this.fetchWithTimeout(url.toString(), {
        headers: {
          'Authorization': `Bearer ${await this.tokenService.getToken()}`,
          'Accept': 'application/json',
        },
      });

      return await response.json();
    } catch (error) {
      console.error('OneMap reverseGeocode Error:', error);
      throw error;
    }
  }
}
