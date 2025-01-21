import type { DatabaseConfig } from './database';

/**
 * Base entity interface
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Filter operator type
 */
export type FilterOperator =
  | 'eq'      // Equal
  | 'neq'     // Not equal
  | 'gt'      // Greater than
  | 'gte'     // Greater than or equal
  | 'lt'      // Less than
  | 'lte'     // Less than or equal
  | 'in'      // In array
  | 'nin'     // Not in array
  | 'like'    // Like pattern
  | 'ilike'   // Case-insensitive like
  | 'between' // Between range
  | 'null'    // Is null
  | 'nnull';  // Is not null

/**
 * Filter condition interface
 */
export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * Filter group type
 */
export type FilterGroup = {
  and?: (FilterCondition | FilterGroup)[];
  or?: (FilterCondition | FilterGroup)[];
  not?: FilterCondition | FilterGroup;
};

/**
 * Filter type
 */
export type Filter<T> = {
  where?: FilterGroup;
  select?: (keyof T)[];
  include?: Record<string, boolean | Filter<any>>;
  orderBy?: Partial<Record<keyof T, 'asc' | 'desc'>>;
  skip?: number;
  take?: number;
};

/**
 * Create input type
 */
export type CreateInput<T> = Omit<T, keyof BaseEntity>;

/**
 * Update input type
 */
export type UpdateInput<T> = Partial<CreateInput<T>>;

/**
 * Repository options interface
 */
export interface RepositoryOptions {
  /**
   * Database configuration
   */
  config: DatabaseConfig;

  /**
   * Table/collection name
   */
  table: string;

  /**
   * Soft delete flag
   */
  softDelete?: boolean;

  /**
   * Default filter
   */
  defaultFilter?: FilterGroup;

  /**
   * Default include relations
   */
  defaultInclude?: Record<string, boolean>;

  /**
   * Default order by
   */
  defaultOrderBy?: Record<string, 'asc' | 'desc'>;
}

/**
 * Repository interface
 */
export interface Repository<T extends BaseEntity> {
  /**
   * Find entity by ID
   */
  findById(id: string, filter?: Filter<T>): Promise<T | null>;

  /**
   * Find first entity matching filter
   */
  findFirst(filter?: Filter<T>): Promise<T | null>;

  /**
   * Find all entities matching filter
   */
  findAll(filter?: Filter<T>): Promise<T[]>;

  /**
   * Count entities matching filter
   */
  count(filter?: Filter<T>): Promise<number>;

  /**
   * Create new entity
   */
  create(data: CreateInput<T>): Promise<T>;

  /**
   * Create multiple entities
   */
  createMany(data: CreateInput<T>[]): Promise<T[]>;

  /**
   * Update entity by ID
   */
  update(id: string, data: UpdateInput<T>): Promise<T>;

  /**
   * Update multiple entities matching filter
   */
  updateMany(filter: Filter<T>, data: UpdateInput<T>): Promise<number>;

  /**
   * Delete entity by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Delete multiple entities matching filter
   */
  deleteMany(filter: Filter<T>): Promise<number>;

  /**
   * Restore soft-deleted entity by ID
   */
  restore?(id: string): Promise<T>;

  /**
   * Restore multiple soft-deleted entities matching filter
   */
  restoreMany?(filter: Filter<T>): Promise<number>;

  /**
   * Execute raw query
   */
  query<R = unknown>(sql: string, params?: unknown[]): Promise<R>;

  /**
   * Execute raw command
   */
  execute(sql: string, params?: unknown[]): Promise<void>;

  /**
   * Start transaction
   */
  transaction<R>(callback: (transaction: Repository<T>) => Promise<R>): Promise<R>;
}

/**
 * Repository factory interface
 */
export interface RepositoryFactory {
  /**
   * Create repository instance
   */
  create<T extends BaseEntity>(options: RepositoryOptions): Repository<T>;
}

/**
 * Repository error interface
 */
export interface RepositoryError extends Error {
  code: string;
  cause?: Error;
  details?: Record<string, unknown>;
}

/**
 * Repository event type
 */
export type RepositoryEvent =
  | 'beforeCreate'
  | 'afterCreate'
  | 'beforeUpdate'
  | 'afterUpdate'
  | 'beforeDelete'
  | 'afterDelete'
  | 'beforeRestore'
  | 'afterRestore'
  | 'error';

/**
 * Repository event data
 */
export interface RepositoryEventData<T extends BaseEntity> {
  /**
   * Entity involved in the event
   */
  entity?: T;

  /**
   * Multiple entities for batch operations
   */
  entities?: T[];

  /**
   * Filter used in the operation
   */
  filter?: Filter<T>;

  /**
   * Changes being applied
   */
  changes?: UpdateInput<T>;

  /**
   * Error that occurred
   */
  error?: Error;
}

/**
 * Repository event handler type
 */
export type RepositoryEventHandler<T extends BaseEntity> = (
  event: RepositoryEvent,
  data: RepositoryEventData<T>
) => void | Promise<void>;
