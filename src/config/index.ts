import type { GoogleMapsConfig } from '@/services/googleMaps';

interface Config {
  env: string;
  apiUrl: string;
  googleMaps: GoogleMapsConfig;
  supabase: {
    url: string;
    anonKey: string;
  };
}

export const config: Config = {
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.VITE_API_URL || 'http://localhost:3000',
  googleMaps: {
    apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    region: 'SG',
    language: 'en',
    libraries: ['places', 'geometry']
  },
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
  }
};

export function validateConfig() {
  const requiredEnvVars = [
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];

  const missingEnvVars = requiredEnvVars.filter(
    envVar => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}