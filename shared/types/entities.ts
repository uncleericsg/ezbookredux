import type { BaseEntity } from './repository';

/**
 * Service entity
 */
export interface Service extends BaseEntity {
  /**
   * Service name
   */
  name: string;

  /**
   * Service description
   */
  description: string;

  /**
   * Service price
   */
  price: number;

  /**
   * Service duration in minutes
   */
  duration: number;

  /**
   * Service category
   */
  category: string;

  /**
   * Service status
   */
  status: 'active' | 'inactive' | 'archived';

  /**
   * Service image URL
   */
  imageUrl?: string;

  /**
   * Service features
   */
  features?: string[];

  /**
   * Service requirements
   */
  requirements?: string[];

  /**
   * Service metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Create service input
 */
export interface CreateServiceInput {
  /**
   * Service name
   */
  name: string;

  /**
   * Service description
   */
  description: string;

  /**
   * Service price
   */
  price: number;

  /**
   * Service duration in minutes
   */
  duration: number;

  /**
   * Service category
   */
  category: string;

  /**
   * Service status
   */
  status?: 'active' | 'inactive' | 'archived';

  /**
   * Service image URL
   */
  imageUrl?: string;

  /**
   * Service features
   */
  features?: string[];

  /**
   * Service requirements
   */
  requirements?: string[];

  /**
   * Service metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Update service input
 */
export interface UpdateServiceInput {
  /**
   * Service name
   */
  name?: string;

  /**
   * Service description
   */
  description?: string;

  /**
   * Service price
   */
  price?: number;

  /**
   * Service duration in minutes
   */
  duration?: number;

  /**
   * Service category
   */
  category?: string;

  /**
   * Service status
   */
  status?: 'active' | 'inactive' | 'archived';

  /**
   * Service image URL
   */
  imageUrl?: string;

  /**
   * Service features
   */
  features?: string[];

  /**
   * Service requirements
   */
  requirements?: string[];

  /**
   * Service metadata
   */
  metadata?: Record<string, unknown>;
}
