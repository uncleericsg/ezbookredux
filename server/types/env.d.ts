declare namespace NodeJS {
  interface ProcessEnv {
    // Required
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    
    // Optional
    PORT?: string;
    NODE_ENV?: 'development' | 'production';
    STRIPE_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  }
}