import { BaseRepository } from './baseRepository';
import type {
  Filter,
  CreateInput,
  UpdateInput,
  RepositoryOptions
} from '@shared/types/repository';
import type { Payment } from '@shared/types/payment';
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
 * Payment repository implementation
 */
export class PaymentRepository extends BaseRepository<Payment> {
  constructor(options: RepositoryOptions) {
    super({
      ...options,
      table: 'payments',
      softDelete: true,
      defaultOrderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Find first payment matching filter
   */
  async findFirst(filter?: Filter<Payment>): Promise<Payment | null> {
    try {
      const result = await prisma.payment.findFirst({
        where: this.buildWhereClause(filter?.where),
        include: {
          ...this.buildIncludeClause(filter?.include),
          booking: Boolean(filter?.include?.booking)
        },
        orderBy: this.buildOrderByClause(filter?.orderBy)
      });

      return result ? this.mapToDomain(result) : null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Find all payments matching filter
   */
  async findAll(filter?: Filter<Payment>): Promise<Payment[]> {
    try {
      const results = await prisma.payment.findMany({
        where: this.buildWhereClause(filter?.where),
        include: {
          ...this.buildIncludeClause(filter?.include),
          booking: Boolean(filter?.include?.booking)
        },
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
   * Count payments matching filter
   */
  async count(filter?: Filter<Payment>): Promise<number> {
    try {
      return await prisma.payment.count({
        where: this.buildWhereClause(filter?.where)
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create new payment
   */
  protected async createEntity(data: CreateInput<Payment>): Promise<Payment> {
    try {
      const result = await prisma.payment.create({
        data: this.mapToDatabase(data),
        include: { booking: true }
      });

      return this.mapToDomain(result);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Create multiple payments
   */
  protected async createManyEntities(data: CreateInput<Payment>[]): Promise<Payment[]> {
    try {
      await prisma.payment.createMany({
        data: data.map((item) => this.mapToDatabase(item))
      });

      // Fetch created payments
      const payments = await this.findAll({
        where: {
          and: [
            { field: 'createdAt', operator: 'gte', value: new Date(Date.now() - 1000) }
          ]
        },
        take: data.length,
        include: { booking: true }
      });

      return payments;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update payment by ID
   */
  protected async updateEntity(id: string, data: UpdateInput<Payment>): Promise<Payment> {
    try {
      const result = await prisma.payment.update({
        where: { id },
        data: this.mapToDatabase(data),
        include: { booking: true }
      });

      return this.mapToDomain(result);
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new DatabaseError('Payment not found', 'RECORD_NOT_FOUND');
      }
      throw this.handleError(error);
    }
  }

  /**
   * Update multiple payments matching filter
   */
  protected async updateManyEntities(filter: Filter<Payment>, data: UpdateInput<Payment>): Promise<number> {
    try {
      const result = await prisma.payment.updateMany({
        where: this.buildWhereClause(filter.where),
        data: this.mapToDatabase(data)
      });
      return result.count;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete payment by ID
   */
  protected async deleteEntity(id: string): Promise<void> {
    try {
      await prisma.payment.delete({
        where: { id }
      });
    } catch (error) {
      if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') {
        throw new DatabaseError('Payment not found', 'RECORD_NOT_FOUND');
      }
      throw this.handleError(error);
    }
  }

  /**
   * Delete multiple payments matching filter
   */
  protected async deleteManyEntities(filter: Filter<Payment>): Promise<number> {
    try {
      const result = await prisma.payment.deleteMany({
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
  async transaction<R>(callback: (transaction: PaymentRepository) => Promise<R>): Promise<R> {
    return prisma.$transaction(async (prismaTransaction: TransactionPrismaClient) => {
      const repository = new PaymentRepository({
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
  private mapToDatabase(data: Partial<Payment>): any {
    const {
      booking,
      providerShipping,
      providerBillingDetails,
      providerPaymentMethodDetails,
      providerMetadata,
      errorDetails,
      disputeEvidence,
      metadata,
      ...rest
    } = data;

    return {
      ...rest,
      ...(providerShipping && {
        providerShippingAddress: JSON.stringify(providerShipping.address),
        providerShippingName: providerShipping.name,
        providerShippingCarrier: providerShipping.carrier,
        providerShippingPhone: providerShipping.phone,
        providerShippingTrackingNumber: providerShipping.tracking_number
      }),
      ...(providerBillingDetails && {
        providerBillingAddress: JSON.stringify(providerBillingDetails.address),
        providerBillingEmail: providerBillingDetails.email,
        providerBillingName: providerBillingDetails.name,
        providerBillingPhone: providerBillingDetails.phone
      }),
      ...(providerPaymentMethodDetails && {
        providerPaymentMethodDetailsJson: JSON.stringify(providerPaymentMethodDetails)
      }),
      ...(providerMetadata && { providerMetadataJson: JSON.stringify(providerMetadata) }),
      ...(errorDetails && { errorDetailsJson: JSON.stringify(errorDetails) }),
      ...(disputeEvidence && { disputeEvidenceJson: JSON.stringify(disputeEvidence) }),
      ...(metadata && { metadataJson: JSON.stringify(metadata) })
    };
  }

  /**
   * Map database model to domain model
   */
  private mapToDomain(data: any): Payment {
    const {
      providerShippingAddress,
      providerShippingName,
      providerShippingCarrier,
      providerShippingPhone,
      providerShippingTrackingNumber,
      providerBillingAddress,
      providerBillingEmail,
      providerBillingName,
      providerBillingPhone,
      providerPaymentMethodDetailsJson,
      providerMetadataJson,
      errorDetailsJson,
      disputeEvidenceJson,
      metadataJson,
      ...rest
    } = data;

    return {
      ...rest,
      ...(providerShippingAddress && {
        providerShipping: {
          address: JSON.parse(providerShippingAddress),
          name: providerShippingName,
          carrier: providerShippingCarrier,
          phone: providerShippingPhone,
          tracking_number: providerShippingTrackingNumber
        }
      }),
      ...(providerBillingAddress && {
        providerBillingDetails: {
          address: JSON.parse(providerBillingAddress),
          email: providerBillingEmail,
          name: providerBillingName,
          phone: providerBillingPhone
        }
      }),
      ...(providerPaymentMethodDetailsJson && {
        providerPaymentMethodDetails: JSON.parse(providerPaymentMethodDetailsJson)
      }),
      ...(providerMetadataJson && { providerMetadata: JSON.parse(providerMetadataJson) }),
      ...(errorDetailsJson && { errorDetails: JSON.parse(errorDetailsJson) }),
      ...(disputeEvidenceJson && { disputeEvidence: JSON.parse(disputeEvidenceJson) }),
      ...(metadataJson && { metadata: JSON.parse(metadataJson) })
    };
  }
}
