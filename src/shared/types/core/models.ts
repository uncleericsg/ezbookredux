import type { BaseError } from './error';

/**
 * Base entity interface for all domain models
 */
export interface BaseEntity {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Creation timestamp (ISO format)
   */
  createdAt: string;

  /**
   * Last update timestamp (ISO format)
   */
  updatedAt: string;
}

/**
 * Entity with audit tracking
 */
export interface AuditableEntity extends BaseEntity {
  /**
   * User ID of creator
   */
  createdBy: string;

  /**
   * User ID of last modifier
   */
  updatedBy: string;

  /**
   * Version number for optimistic locking
   */
  version: number;
}

/**
 * Entity metadata for tracking changes
 */
export interface EntityMetadata {
  /**
   * Current version number
   */
  version: number;

  /**
   * Change history
   */
  changes: Array<{
    /**
     * Field name that changed
     */
    field: string;

    /**
     * Previous value
     */
    oldValue: unknown;

    /**
     * New value
     */
    newValue: unknown;
  }>;

  /**
   * Current entity state
   */
  state: 'active' | 'archived' | 'deleted';
}

/**
 * Reference to another entity
 */
export interface EntityReference<T> {
  /**
   * Referenced entity ID
   */
  id: string;

  /**
   * Entity type
   */
  type: string;

  /**
   * Lazy loading function
   */
  load(): Promise<T>;
}

/**
 * Error response for model operations
 */
export interface ModelErrorResponse {
  /**
   * Error details
   */
  error: BaseError;

  /**
   * Affected entity ID
   */
  entityId?: string;

  /**
   * Operation that failed
   */
  operation: 'create' | 'read' | 'update' | 'delete';
}

/**
 * Type guard for BaseEntity
 */
export const isBaseEntity = (value: unknown): value is BaseEntity => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'createdAt' in value &&
    'updatedAt' in value
  );
};

/**
 * Type guard for AuditableEntity
 */
export const isAuditableEntity = (value: unknown): value is AuditableEntity => {
  return (
    isBaseEntity(value) &&
    'createdBy' in value &&
    'updatedBy' in value &&
    'version' in value
  );
};