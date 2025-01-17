export const SUPABASE_CONFIG = {
  // Auth related
  AUTH: {
    COOKIE_OPTIONS: {
      name: 'sb-access-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/'
    }
  },
  
  // Storage related
  STORAGE: {
    BUCKETS: {
      AVATARS: 'avatars',
      DOCUMENTS: 'documents'
    },
    MAX_FILE_SIZE: 5 * 1024 * 1024 // 5MB
  },

  // Database schemas
  SCHEMAS: {
    PUBLIC: 'public',
    AUTH: 'auth'
  },

  // Error messages
  ERRORS: {
    AUTH_REQUIRED: 'Authentication required',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SESSION_EXPIRED: 'Session expired'
  }
} as const; 