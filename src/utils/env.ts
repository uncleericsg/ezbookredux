import * as dotenv from 'dotenv';

// Initialize environment variables
export function initEnv() {
  dotenv.config();
}

// Get environment variable with type safety
export function getEnvVar(key: string, required = false): string | undefined {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

// Get required environment variable
export function getRequiredEnvVar(key: string): string {
  const value = getEnvVar(key, true);
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
} 