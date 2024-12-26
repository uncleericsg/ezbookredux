import { ApiError } from '../utils/apiErrors';
import { auth, db } from './firebase';
import { getStripe } from './stripe';
import { initGooglePlaces } from './googlePlaces';
import { toast } from 'sonner';
import { signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import type { PricingOption } from '@types/booking';

interface ServiceInitOptions {
  retryAttempts?: number;
  timeout?: number;
  features?: Record<string, boolean>;
}

interface ServiceStatus {
  initialized: boolean;
  error?: Error;
  lastInitAttempt?: Date;
}

// Function to get service pricing
async function getServicePricing(): Promise<PricingOption[]> {
  try {
    const pricingRef = collection(db, 'pricing');
    const snapshot = await getDocs(pricingRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PricingOption));
  } catch (error) {
    console.error('Error fetching service pricing:', error);
    throw new ApiError(
      'Failed to fetch service pricing',
      'PRICING_ERROR',
      { context: 'Pricing Fetch' }
    );
  }
}

class ServiceManager {
  private static instance: ServiceManager;
  private initializationOrder: string[] = [
    'core',
    'auth',
    'firebase',
    'notifications',
    'payment',
    'location'
  ];
  
  private serviceStatus: Record<string, ServiceStatus> = {};
  private features: Record<string, boolean> = {};
  private initPromises: Record<string, Promise<void>> = {};

  private constructor() {
    // Initialize status for all services
    this.initializationOrder.forEach(service => {
      this.serviceStatus[service] = { initialized: false };
    });
  }

  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  async initializeServices(options: ServiceInitOptions = {}): Promise<void> {
    const { retryAttempts = 3, timeout = 30000 } = options;
    this.features = options.features || {};

    for (const serviceName of this.initializationOrder) {
      try {
        await this.initializeService(serviceName, retryAttempts, timeout);
      } catch (error) {
        this.serviceStatus[serviceName] = {
          initialized: false,
          error: error instanceof Error ? error : new Error(String(error)),
          lastInitAttempt: new Date()
        };

        // Throw error for critical services
        if (['core', 'auth', 'firebase'].includes(serviceName)) {
          throw new ApiError(
            `Failed to initialize critical service: ${serviceName}`,
            'SERVICE_INIT_ERROR',
            { context: 'Service Initialization', retryable: true }
          );
        }

        // Non-critical services: log error and continue
        console.error(`Failed to initialize service ${serviceName}:`, error);
        toast.error(`Some features may be limited: ${serviceName} initialization failed`);
      }
    }
  }

  private async initializeService(
    serviceName: string,
    retryAttempts: number,
    timeout: number
  ): Promise<void> {
    // Return existing initialization if in progress
    if (this.initPromises[serviceName]) {
      return this.initPromises[serviceName];
    }

    this.initPromises[serviceName] = new Promise(async (resolve, reject) => {
      for (let attempt = 0; attempt < retryAttempts; attempt++) {
        try {
          // Initialize with timeout
          await Promise.race([
            this.doServiceInitialization(serviceName),
            new Promise((_, timeoutReject) => 
              setTimeout(() => timeoutReject(new Error('Initialization timeout')), timeout)
            )
          ]);

          this.serviceStatus[serviceName] = {
            initialized: true,
            lastInitAttempt: new Date()
          };
          resolve();
          return;
        } catch (error) {
          if (attempt === retryAttempts - 1) {
            reject(error);
          }
          // Wait before retry with exponential backoff
          await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
      }
    });

    return this.initPromises[serviceName];
  }

  private async doServiceInitialization(serviceName: string): Promise<void> {
    console.log(`Initializing service: ${serviceName}`);
    
    switch (serviceName) {
      case 'core':
        // Basic environment and config checks
        if (!import.meta.env.VITE_FIREBASE_API_KEY) {
          console.error('Missing Firebase API key');
          throw new Error('Missing required environment variables');
        }
        console.log('Core initialization complete');
        break;

      case 'auth':
        // Initialize Firebase Auth
        try {
          console.log('Initializing Firebase Auth...');
          await signInAnonymously(auth);
          console.log('Firebase Auth initialized successfully');
        } catch (error) {
          console.error('Firebase Auth initialization failed:', error);
          throw new ApiError(
            'Failed to initialize authentication',
            'FIREBASE_AUTH_ERROR',
            { context: 'Auth Initialization' }
          );
        }
        break;

      case 'firebase':
        // Test Firestore connection
        try {
          console.log('Testing Firestore connection...');
          // Wait for auth to be initialized and user to be signed in
          const user = auth.currentUser;
          if (!user) {
            // Sign in anonymously if no user
            await signInAnonymously(auth);
          }
          
          // Now try to access Firestore with authenticated user
          const testRef = collection(db, '_test_');
          await getDocs(testRef).then(() => {
            console.log('Firestore connection successful');
          });
        } catch (error) {
          console.error('Firestore connection failed:', error);
          if (error instanceof Error && error.message.includes('offline')) {
            throw new ApiError(
              'Failed to connect to Firestore - Please check your internet connection',
              'FIREBASE_DB_ERROR',
              { context: 'Firebase Initialization', retryable: true }
            );
          }
          throw new ApiError(
            'Failed to initialize Firestore',
            'FIREBASE_DB_ERROR',
            { context: 'Firebase Initialization' }
          );
        }
        break;

      case 'payment':
        if (this.isFeatureEnabled('payments')) {
          try {
            console.log('Initializing Stripe...');
            await getStripe();
            console.log('Stripe initialized successfully');
          } catch (error) {
            console.error('Stripe initialization failed:', error);
            throw new ApiError(
              'Failed to initialize Stripe',
              'STRIPE_ERROR',
              { context: 'Payment Initialization' }
            );
          }
        } else {
          console.log('Payments feature disabled, skipping Stripe initialization');
        }
        break;

      case 'location':
        if (this.isFeatureEnabled('location_services')) {
          try {
            console.log('Initializing Google Places...');
            await initGooglePlaces();
            console.log('Google Places initialized successfully');
          } catch (error) {
            console.error('Google Places initialization failed:', error);
            throw new ApiError(
              'Failed to initialize Google Places',
              'MAPS_ERROR',
              { context: 'Location Services Initialization' }
            );
          }
        } else {
          console.log('Location services disabled, skipping Google Places initialization');
        }
        break;
    }
    console.log(`Service ${serviceName} initialized successfully`);
  }

  public isFeatureEnabled(feature: string): boolean {
    return this.features[feature] ?? false;
  }

  public getServiceStatus(serviceName: string): ServiceStatus | undefined {
    return this.serviceStatus[serviceName];
  }

  public isServiceInitialized(serviceName: string): boolean {
    return this.serviceStatus[serviceName]?.initialized ?? false;
  }

  public async reinitializeService(serviceName: string): Promise<void> {
    delete this.initPromises[serviceName];
    this.serviceStatus[serviceName] = { initialized: false };
    await this.initializeService(serviceName, 3, 30000);
  }
}

// Export types and values
export type { ServiceInitOptions };
export { getServicePricing, ServiceManager };
