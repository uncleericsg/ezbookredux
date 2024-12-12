import { oneMapConfig } from '../../config/oneMapConfig';

interface TokenResponse {
  access_token: string;
  expiry_timestamp: number;
}

export class OneMapTokenService {
  private static instance: OneMapTokenService;
  private currentToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<string> | null = null;

  private constructor() {}

  static getInstance(): OneMapTokenService {
    if (!OneMapTokenService.instance) {
      OneMapTokenService.instance = new OneMapTokenService();
    }
    return OneMapTokenService.instance;
  }

  private async refreshToken(): Promise<string> {
    try {
      console.log('Refreshing OneMap token...');
      
      // Use the proxy endpoint
      const response = await fetch('/onemap/privateapi/auth/post/getToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: oneMapConfig.VITE_ONEMAP_EMAIL,
          password: oneMapConfig.VITE_ONEMAP_PASSWORD,
        }),
      });

      console.log('Token refresh response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh error response:', errorText);
        
        // Check for specific error cases
        if (response.status === 401) {
          throw new Error('Invalid OneMap credentials. Please check your email and password.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Please check your OneMap account permissions.');
        }
        
        throw new Error(`Failed to refresh token: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Token refresh successful, expires:', new Date(data.expiry_timestamp * 1000).toLocaleString());

      if (!data.access_token) {
        console.error('Invalid token response:', data);
        throw new Error('Invalid token response from OneMap API');
      }

      this.currentToken = data.access_token;
      this.tokenExpiry = data.expiry_timestamp * 1000; // Convert to milliseconds

      return data.access_token;
    } catch (error) {
      console.error('Error refreshing OneMap token:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Network error while refreshing token - Please check your internet connection and ensure you can access the OneMap API');
        }
        // Pass through specific error messages
        throw error;
      }
      
      throw new Error('An unexpected error occurred while refreshing the OneMap token');
    }
  }

  async getToken(): Promise<string> {
    try {
      // If we have a valid token, return it
      if (
        this.currentToken &&
        this.tokenExpiry &&
        this.tokenExpiry > Date.now() + 5 * 60 * 1000 // Add 5 minutes buffer
      ) {
        return this.currentToken;
      }

      // If a refresh is already in progress, wait for it
      if (this.refreshPromise) {
        return this.refreshPromise;
      }

      // Start a new refresh
      this.refreshPromise = this.refreshToken();

      try {
        const token = await this.refreshPromise;
        return token;
      } finally {
        this.refreshPromise = null;
      }
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  // Call this when initializing your app
  async initialize(): Promise<void> {
    try {
      console.log('Initializing OneMap token service...');
      await this.getToken();
      console.log('OneMap token service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize OneMap token service:', error);
      throw error;
    }
  }
}
