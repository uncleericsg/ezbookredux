/**
 * Service types
 */

/**
 * Service status
 */
export type ServiceStatus = 'active' | 'inactive' | 'archived';

/**
 * Service category
 */
export type ServiceCategory = 
  | 'maintenance'
  | 'repair'
  | 'installation'
  | 'cleaning'
  | 'inspection'
  | 'consultation';

/**
 * Service validation result
 */
export interface ServiceValidation {
  /**
   * Is valid flag
   */
  isValid: boolean;

  /**
   * Validation errors
   */
  errors?: {
    /**
     * Title errors
     */
    title?: string[];

    /**
     * Description errors
     */
    description?: string[];

    /**
     * Category errors
     */
    category?: string[];

    /**
     * Price errors
     */
    price?: string[];

    /**
     * Duration errors
     */
    duration?: string[];

    /**
     * Status errors
     */
    status?: string[];

    /**
     * General errors
     */
    general?: string[];
  };
}

/**
 * Service configuration
 */
export interface ServiceConfig {
  /**
   * Service name
   */
  name: string;

  /**
   * Service version
   */
  version: string;

  /**
   * Service environment
   */
  environment: 'development' | 'staging' | 'production';

  /**
   * Service port
   */
  port: number;

  /**
   * Service host
   */
  host: string;

  /**
   * Service base URL
   */
  baseUrl: string;

  /**
   * Service API version
   */
  apiVersion: string;

  /**
   * Service timeout in milliseconds
   */
  timeout: number;

  /**
   * Service rate limit
   */
  rateLimit?: {
    /**
     * Window size in milliseconds
     */
    windowMs: number;

    /**
     * Maximum requests per window
     */
    max: number;
  };

  /**
   * Security configuration
   */
  security: {
    /**
     * CORS configuration
     */
    cors: {
      /**
       * Enable CORS
       */
      enabled: boolean;

      /**
       * Allowed origins
       */
      origins: string[];

      /**
       * Allowed methods
       */
      methods: string[];

      /**
       * Allowed headers
       */
      headers: string[];

      /**
       * Allow credentials
       */
      credentials: boolean;
    };

    /**
     * Rate limiting configuration
     */
    rateLimit: {
      /**
       * Enable rate limiting
       */
      enabled: boolean;

      /**
       * Window size in milliseconds
       */
      windowMs: number;

      /**
       * Maximum requests per window
       */
      max: number;
    };

    /**
     * Helmet configuration
     */
    helmet: {
      /**
       * Enable Helmet
       */
      enabled: boolean;

      /**
       * Content Security Policy
       */
      contentSecurityPolicy: boolean;

      /**
       * XSS Protection
       */
      xssFilter: boolean;

      /**
       * Frame options
       */
      frameguard: boolean;

      /**
       * Additional options
       */
      options: Record<string, unknown>;
    };
  };

  /**
   * Performance configuration
   */
  performance: {
    /**
     * Static file serving
     */
    static: {
      /**
       * Enable static file serving
       */
      enabled: boolean;

      /**
       * Static file directory
       */
      dir: string;

      /**
       * Cache control header
       */
      cacheControl: string;

      /**
       * Max age in seconds
       */
      maxAge: number;

      /**
       * Enable ETag
       */
      etag: boolean;
    };

    /**
     * Compression configuration
     */
    compression: {
      /**
       * Enable compression
       */
      enabled: boolean;

      /**
       * Compression level
       */
      level: number;
    };

    /**
     * Cache configuration
     */
    cache: {
      /**
       * Enable caching
       */
      enabled: boolean;

      /**
       * Cache TTL in seconds
       */
      ttl: number;
    };
  };

  /**
   * Logging configuration
   */
  logging: {
    /**
     * Log level
     */
    level: 'debug' | 'info' | 'warn' | 'error';

    /**
     * Enable request logging
     */
    requests: boolean;

    /**
     * Enable response logging
     */
    responses: boolean;

    /**
     * Enable error logging
     */
    errors: boolean;

    /**
     * Enable performance logging
     */
    performance: boolean;

    /**
     * Console logging configuration
     */
    console: {
      /**
       * Enable console logging
       */
      enabled: boolean;

      /**
       * Console log format
       */
      format: string;
    };
  };
}

/**
 * Service entity
 */
export interface Service {
  /**
   * Service ID
   */
  id: string;

  /**
   * Service title
   */
  title: string;

  /**
   * Service description
   */
  description: string;

  /**
   * Service category
   */
  category: ServiceCategory;

  /**
   * Service price
   */
  price: number;

  /**
   * Service duration in minutes
   */
  duration: number;

  /**
   * Service status
   */
  status: ServiceStatus;

  /**
   * Service image URL
   */
  image_url?: string;

  /**
   * Technician requirements
   */
  technician_requirements?: string[];

  /**
   * Created at timestamp
   */
  created_at: string;

  /**
   * Updated at timestamp
   */
  updated_at: string;
}

/**
 * Database service
 */
export interface DatabaseService extends Service {}

/**
 * Create service parameters
 */
export interface CreateServiceParams {
  /**
   * Service title
   */
  title: string;

  /**
   * Service description
   */
  description: string;

  /**
   * Service category
   */
  category: ServiceCategory;

  /**
   * Service price
   */
  price: number;

  /**
   * Service duration in minutes
   */
  duration: number;

  /**
   * Service image URL
   */
  image_url?: string;

  /**
   * Technician requirements
   */
  technician_requirements?: string[];
}

/**
 * Update service parameters
 */
export interface UpdateServiceParams {
  /**
   * Service title
   */
  title?: string;

  /**
   * Service description
   */
  description?: string;

  /**
   * Service category
   */
  category?: ServiceCategory;

  /**
   * Service price
   */
  price?: number;

  /**
   * Service duration in minutes
   */
  duration?: number;

  /**
   * Service status
   */
  status?: ServiceStatus;

  /**
   * Service image URL
   */
  image_url?: string;

  /**
   * Technician requirements
   */
  technician_requirements?: string[];
}

/**
 * Service filters
 */
export interface ServiceFilters {
  /**
   * Filter by status
   */
  status?: ServiceStatus;

  /**
   * Filter by minimum price
   */
  minPrice?: number;

  /**
   * Filter by maximum price
   */
  maxPrice?: number;

  /**
   * Search in title and description
   */
  search?: string;
}

/**
 * Service manager interface
 */
export interface ServiceManager {
  /**
   * Create a new service
   */
  createService(params: CreateServiceParams): Promise<Service>;

  /**
   * Update a service
   */
  updateService(serviceId: string, params: UpdateServiceParams): Promise<Service>;

  /**
   * Get service by ID
   */
  getServiceById(serviceId: string): Promise<Service>;

  /**
   * Get services with optional filters
   */
  getServices(filters?: ServiceFilters): Promise<Service[]>;

  /**
   * Get services by category with optional filters
   */
  getServicesByCategory(category: ServiceCategory, filters?: ServiceFilters): Promise<Service[]>;
}
