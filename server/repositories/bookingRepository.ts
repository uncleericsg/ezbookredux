import { BaseRepository } from './baseRepository';
import type {
  Filter,
  CreateInput,
  UpdateInput,
  RepositoryOptions
} from '@shared/types/repository';
import type { Booking } from '@shared/types/booking';
import { DatabaseError } from '@shared/types/error';
import { PrismaClient, Prisma } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

type TransactionPrismaClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

/**
 * Booking repository implementation
 */
export class BookingRepository extends BaseRepository<Booking> {
  constructor(options: RepositoryOptions) {
    super({
      ...options,
      table: 'bookings',
      softDelete: true,
      defaultOrderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Find first booking matching filter
   */
  async findFirst(filter?: Filter<Booking>): Promise<Booking | null> {
    try {
      const result = await prisma.booking.findFirst({
        where: this.buildWhereClause(filter?.where),
        include: this.buildIncludeClause(filter?.include),
        orderBy: this.buildOrderByClause(filter?.orderBy)
      });

      return result ? this.mapToDomain(result) : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find all bookings matching filter
   */
  async findAll(filter?: Filter<Booking>): Promise<Booking[]> {
    try {
      const results = await prisma.booking.findMany({
        where: this.buildWhereClause(filter?.where),
        include: this.buildIncludeClause(filter?.include),
        orderBy: this.buildOrderByClause(filter?.orderBy),
        skip: filter?.skip,
        take: filter?.take
      });

      return results.map((result) => this.mapToDomain(result));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Count bookings matching filter
   */
  async count(filter?: Filter<Booking>): Promise<number> {
    try {
      return await prisma.booking.count({
        where: this.buildWhereClause(filter?.where)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new booking
   */
  protected async createEntity(data: CreateInput<Booking>): Promise<Booking> {
    try {
      const result = await prisma.booking.create({
        data: this.mapToDatabase(data)
      });

      return this.mapToDomain(result);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create multiple bookings
   */
  protected async createManyEntities(data: CreateInput<Booking>[]): Promise<Booking[]> {
    try {
      await prisma.booking.createMany({
        data: data.map((item) => this.mapToDatabase(item))
      });

      // Fetch created bookings
      const bookings = await this.findAll({
        where: {
          and: [
            { field: 'createdAt', operator: 'gte', value: new Date(Date.now() - 1000) }
          ]
        },
        take: data.length
      });

      return bookings;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update booking by ID
   */
  protected async updateEntity(id: string, data: UpdateInput<Booking>): Promise<Booking> {
    try {
      const result = await prisma.booking.update({
        where: { id },
        data: this.mapToDatabase(data)
      });

      return this.mapToDomain(result);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new DatabaseError('Booking not found', 'RECORD_NOT_FOUND');
      }
      throw this.handleError(error);
    }
  }

  /**
   * Update multiple bookings matching filter
   */
  protected async updateManyEntities(filter: Filter<Booking>, data: UpdateInput<Booking>): Promise<number> {
    try {
      const result = await prisma.booking.updateMany({
        where: this.buildWhereClause(filter.where),
        data: this.mapToDatabase(data)
      });
      return result.count;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete booking by ID
   */
  protected async deleteEntity(id: string): Promise<void> {
    try {
      await prisma.booking.delete({
        where: { id }
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new DatabaseError('Booking not found', 'RECORD_NOT_FOUND');
      }
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple bookings matching filter
   */
  protected async deleteManyEntities(filter: Filter<Booking>): Promise<number> {
    try {
      const result = await prisma.booking.deleteMany({
        where: this.buildWhereClause(filter.where)
      });
      return result.count;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute raw query
   */
  async query<R = unknown>(sql: string, params?: unknown[]): Promise<R> {
    try {
      const result = await prisma.$queryRawUnsafe<R>(sql, ...(params || []));
      return result;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Execute raw command
   */
  async execute(sql: string, params?: unknown[]): Promise<void> {
    try {
      await prisma.$executeRawUnsafe(sql, ...(params || []));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Start transaction
   */
  async transaction<R>(callback: (transaction: BookingRepository) => Promise<R>): Promise<R> {
    return prisma.$transaction(async (prismaTransaction: TransactionPrismaClient) => {
      const repository = new BookingRepository({
        ...this.options,
        config: {
          ...this.options.config,
          prisma: prismaTransaction as unknown as PrismaClient
        }
      });
      return callback(repository);
    });
  }

  /**
   * Map domain model to database model
   */
  private mapToDatabase(data: Partial<Booking>): any {
    const { location, completion, rescheduling, metadata, ...rest } = data;
    return {
      ...rest,
      ...(location && {
        locationAddress: location.address,
        locationPostalCode: location.postalCode,
        locationLat: location.coordinates?.lat,
        locationLng: location.coordinates?.lng
      }),
      ...(completion && {
        completedAt: completion.completedAt,
        completionDuration: completion.duration,
        completionNotes: completion.notes,
        rating: completion.rating,
        review: completion.review,
        photos: completion.photos
      }),
      ...(rescheduling && {
        reschedulingFromDate: rescheduling.fromDate,
        reschedulingFromTime: rescheduling.fromTime,
        reschedulingReason: rescheduling.reason
      }),
      ...(metadata && { metadata: JSON.stringify(metadata) })
    };
  }

  /**
   * Map database model to domain model
   */
  private mapToDomain(data: any): Booking {
    const {
      locationAddress,
      locationPostalCode,
      locationLat,
      locationLng,
      completedAt,
      completionDuration,
      completionNotes,
      rating,
      review,
      photos,
      reschedulingFromDate,
      reschedulingFromTime,
      reschedulingReason,
      metadata,
      ...rest
    } = data;

    return {
      ...rest,
      location: {
        address: locationAddress,
        postalCode: locationPostalCode,
        ...(locationLat && locationLng && {
          coordinates: {
            lat: locationLat,
            lng: locationLng
          }
        })
      },
      ...(completedAt && {
        completion: {
          completedAt,
          duration: completionDuration,
          notes: completionNotes,
          ...(rating !== null && { rating }),
          ...(review && { review }),
          ...(photos && { photos })
        }
      }),
      ...(reschedulingFromDate && {
        rescheduling: {
          fromDate: reschedulingFromDate,
          fromTime: reschedulingFromTime,
          reason: reschedulingReason
        }
      }),
      ...(metadata && { metadata: JSON.parse(metadata) })
    };
  }
}
