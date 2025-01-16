import { config } from 'dotenv';

// Load environment variables
config();

/**
 * Get an environment variable
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if the environment variable is not set
 * @returns The environment variable value or the default value
 */
export function getEnvVar(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Get a required environment variable
 * @param key - The environment variable key
 * @throws {Error} If the environment variable is not set
 * @returns The environment variable value
 */
export function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

// Export commonly used environment variables
export const ENV = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  STRIPE_SECRET_KEY: getRequiredEnvVar('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getRequiredEnvVar('STRIPE_WEBHOOK_SECRET'),
  GOOGLE_MAPS_API_KEY: getRequiredEnvVar('GOOGLE_MAPS_API_KEY'),
  SUPABASE_URL: getRequiredEnvVar('SUPABASE_URL'),
  SUPABASE_ANON_KEY: getRequiredEnvVar('SUPABASE_ANON_KEY'),
  FIREBASE_CONFIG: {
    apiKey: getRequiredEnvVar('FIREBASE_API_KEY'),
    authDomain: getRequiredEnvVar('FIREBASE_AUTH_DOMAIN'),
    projectId: getRequiredEnvVar('FIREBASE_PROJECT_ID'),
    storageBucket: getRequiredEnvVar('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getRequiredEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getRequiredEnvVar('FIREBASE_APP_ID')
  }
} as const; 