import type {
  BaseEntity,
  Repository,
  RepositoryOptions,
  Filter,
  FilterGroup,
  FilterCondition,
  CreateInput,
  UpdateInput,
  RepositoryError,
  RepositoryEvent,
  RepositoryEventHandler
} from '@shared/types/repository';
import { DatabaseError } from '@shared/types/error';
import { logger } from '@server/utils/logger';

/**
 * Base repository implementation
 */
export abstract class BaseRepository<T extends BaseEntity> implements Repository<T> {
  protected options: RepositoryOptions;
  private eventHandlers: Map<RepositoryEvent, Set<RepositoryEventHandler<T>>> = new Map();

  constructor(options: RepositoryOptions) {
    this.options = options;
  }

  /**
   * Find entity by ID
   */
  async findById(id: string, filter?: Filter<T>): Promise<T | null> {
    try {
      const idCondition: FilterCondition = {
        field: 'id',
        operator: 'eq',
        value: id
      };

      const softDeleteCondition: FilterCondition = {
        field: 'deletedAt',
        operator: 'null',
        value: null
      };

      const mergedFilter: Filter<T> = {
        where: {
          and: [
            idCondition,
            ...(this.options.softDelete ? [softDeleteCondition] : []),
            ...(filter?.where ? [filter.where] : []),
            ...(this.options.defaultFilter ? [this.options.defaultFilter] : [])
          ]
        },
        ...filter,
        include: {
          ...this.options.defaultInclude,
          ...filter?.include
        },
        orderBy: filter?.orderBy ?? (this.options.defaultOrderBy as Partial<Record<keyof T, 'asc' | 'desc'>> | undefined)
      };

      return this.findFirst(mergedFilter);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find first entity matching filter
   */
  abstract findFirst(filter?: Filter<T>): Promise<T | null>;

  /**
   * Find all entities matching filter
   */
  abstract findAll(filter?: Filter<T>): Promise<T[]>;

  /**
   * Count entities matching filter
   */
  abstract count(filter?: Filter<T>): Promise<number>;

  /**
   * Create new entity
   */
  async create(data: CreateInput<T>): Promise<T> {
    try {
      await this.emit('beforeCreate', { changes: data });
      const entity = await this.createEntity(data);
      await this.emit('afterCreate', { entity });
      return entity;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create multiple entities
   */
  async createMany(data: CreateInput<T>[]): Promise<T[]> {
    try {
      await this.emit('beforeCreate', { changes: data[0] });
      const entities = await this.createManyEntities(data);
      await this.emit('afterCreate', { entity: entities[0], entities });
      return entities;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update entity by ID
   */
  async update(id: string, data: UpdateInput<T>): Promise<T> {
    try {
      const entity = await this.findById(id);
      if (!entity) {
        throw new DatabaseError('Entity not found', 'RECORD_NOT_FOUND');
      }

      await this.emit('beforeUpdate', { entity, changes: data });
      const updatedEntity = await this.updateEntity(id, data);
      await this.emit('afterUpdate', { entity: updatedEntity });
      return updatedEntity;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update multiple entities matching filter
   */
  async updateMany(filter: Filter<T>, data: UpdateInput<T>): Promise<number> {
    try {
      await this.emit('beforeUpdate', { filter, changes: data });
      const count = await this.updateManyEntities(filter, data);
      await this.emit('afterUpdate', { filter, changes: data });
      return count;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const entity = await this.findById(id);
      if (!entity) {
        throw new DatabaseError('Entity not found', 'RECORD_NOT_FOUND');
      }

      await this.emit('beforeDelete', { entity });
      
      if (this.options.softDelete) {
        await this.updateEntity(id, { deletedAt: new Date() } as unknown as UpdateInput<T>);
      } else {
        await this.deleteEntity(id);
      }

      await this.emit('afterDelete', { entity });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple entities matching filter
   */
  async deleteMany(filter: Filter<T>): Promise<number> {
    try {
      await this.emit('beforeDelete', { filter });
      
      let count: number;
      if (this.options.softDelete) {
        const data = { deletedAt: new Date() } as unknown as UpdateInput<T>;
        count = await this.updateManyEntities(filter, data);
      } else {
        count = await this.deleteManyEntities(filter);
      }

      await this.emit('afterDelete', { filter });
      return count;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute raw query
   */
  abstract query<R = unknown>(sql: string, params?: unknown[]): Promise<R>;

  /**
   * Execute raw command
   */
  abstract execute(sql: string, params?: unknown[]): Promise<void>;

  /**
   * Start transaction
   */
  abstract transaction<R>(callback: (transaction: Repository<T>) => Promise<R>): Promise<R>;

  /**
   * Register event handler
   */
  on(event: RepositoryEvent, handler: RepositoryEventHandler<T>): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  /**
   * Unregister event handler
   */
  off(event: RepositoryEvent, handler: RepositoryEventHandler<T>): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  /**
   * Emit event
   */
  protected async emit(event: RepositoryEvent, data: Parameters<RepositoryEventHandler<T>>[1]): Promise<void> {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          await handler(event, data);
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Unknown error');
          logger.error(`Error in repository event handler for ${event}`, err);
          await this.emit('error', { error: err });
        }
      }
    }
  }

  /**
   * Handle error
   */
  protected handleError(error: unknown): never {
    const repositoryError: RepositoryError = {
      name: 'RepositoryError',
      message: error instanceof Error ? error.message : 'Unknown error',
      code: error instanceof DatabaseError ? error.code : 'DB_ERROR',
      cause: error instanceof Error ? error : undefined,
      stack: error instanceof Error ? error.stack : undefined
    };

    this.emit('error', { error: repositoryError }).catch((err) => {
      logger.error('Error emitting repository error event', err instanceof Error ? err : new Error('Unknown error'));
    });
    throw repositoryError;
  }

  /**
   * Build Prisma where clause from filter
   */
  protected buildWhereClause(filter?: Filter<T>['where']): any {
    if (!filter) return {};

    const where: any = {};

    if (filter.and) {
      where.AND = filter.and.map(condition => {
        if ('field' in condition) {
          const { field, operator, value } = condition;
          switch (operator) {
            case 'eq': return { [field]: { equals: value } };
            case 'neq': return { [field]: { not: value } };
            case 'gt': return { [field]: { gt: value } };
            case 'gte': return { [field]: { gte: value } };
            case 'lt': return { [field]: { lt: value } };
            case 'lte': return { [field]: { lte: value } };
            case 'in': return { [field]: { in: value as any[] } };
            case 'nin': return { [field]: { notIn: value as any[] } };
            case 'like': return { [field]: { contains: value as string } };
            case 'ilike': return { [field]: { contains: value as string, mode: 'insensitive' } };
            case 'between': return {
              AND: [
                { [field]: { gte: (value as [any, any])[0] } },
                { [field]: { lte: (value as [any, any])[1] } }
              ]
            };
            case 'null': return { [field]: { equals: null } };
            case 'nnull': return { [field]: { not: null } };
            default: return {};
          }
        }
        return this.buildWhereClause(condition);
      });
    }

    if (filter.or) {
      where.OR = filter.or.map(condition => {
        if ('field' in condition) {
          return this.buildWhereClause({ and: [condition] });
        }
        return this.buildWhereClause(condition);
      });
    }

    if (filter.not) {
      where.NOT = this.buildWhereClause({ and: [filter.not] });
    }

    return where;
  }

  /**
   * Build Prisma include clause from filter
   */
  protected buildIncludeClause(include?: Filter<T>['include']): any {
    if (!include) return {};

    const result: any = {};
    for (const [key, value] of Object.entries(include)) {
      if (typeof value === 'boolean') {
        result[key] = value;
      } else {
        result[key] = {
          where: this.buildWhereClause(value.where),
          include: this.buildIncludeClause(value.include),
          orderBy: this.buildOrderByClause(value.orderBy),
          skip: value.skip,
          take: value.take
        };
      }
    }
    return result;
  }

  /**
   * Build Prisma orderBy clause from filter
   */
  protected buildOrderByClause(orderBy?: Filter<T>['orderBy']): any {
    if (!orderBy) return undefined;
    return Object.entries(orderBy).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value.toLowerCase()
    }), {});
  }

  /**
   * Abstract methods to be implemented by specific repository implementations
   */
  protected abstract createEntity(data: CreateInput<T>): Promise<T>;
  protected abstract createManyEntities(data: CreateInput<T>[]): Promise<T[]>;
  protected abstract updateEntity(id: string, data: UpdateInput<T>): Promise<T>;
  protected abstract updateManyEntities(filter: Filter<T>, data: UpdateInput<T>): Promise<number>;
  protected abstract deleteEntity(id: string): Promise<void>;
  protected abstract deleteManyEntities(filter: Filter<T>): Promise<number>;
}
