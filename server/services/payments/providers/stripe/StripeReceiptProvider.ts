import Stripe from 'stripe';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import { 
  ReceiptProvider,
  Receipt,
  GenerateReceiptParams 
} from '../../interfaces/ReceiptProvider';

export class StripeReceiptProvider implements ReceiptProvider {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
      typescript: true,
    });
  }

  async generateReceipt(params: GenerateReceiptParams): Promise<Receipt> {
    try {
      const { paymentId, customerEmail, amount, currency, description, metadata } = params;

      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId, {
        expand: ['payment_method', 'customer', 'charges.data.balance_transaction']
      });

      if (paymentIntent.status !== 'succeeded') {
        throw new ApiError(
          'Cannot generate receipt for incomplete payment',
          'INVALID_PAYMENT_STATUS'
        );
      }

      const charge = paymentIntent.charges.data[0];
      if (!charge) {
        throw new ApiError('No charge found for payment', 'NO_CHARGE_FOUND');
      }

      // Update charge with receipt email and description if provided
      if (customerEmail || description) {
        await this.stripe.charges.update(charge.id, {
          receipt_email: customerEmail,
          description
        });
      }

      const receipt = await this.createReceiptFromCharge(charge);
      logger.info('Generated receipt', {
        paymentId,
        receiptId: receipt.id,
        amount: receipt.metadata?.amount
      });

      return receipt;
    } catch (error) {
      logger.error('Failed to generate receipt', { error, paymentId: params.paymentId });
      throw new ApiError(
        'Failed to generate receipt',
        'RECEIPT_GENERATION_ERROR'
      );
    }
  }

  async getReceiptById(receiptId: string): Promise<Receipt> {
    try {
      const charge = await this.stripe.charges.retrieve(receiptId, {
        expand: ['balance_transaction']
      });

      const receipt = await this.createReceiptFromCharge(charge);
      logger.info('Retrieved receipt', {
        receiptId,
        chargeId: charge.id
      });

      return receipt;
    } catch (error) {
      logger.error('Failed to retrieve receipt', { error, receiptId });
      throw new ApiError(
        'Failed to retrieve receipt',
        'RECEIPT_RETRIEVAL_ERROR'
      );
    }
  }

  async listReceiptsByPayment(paymentId: string): Promise<Receipt[]> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentId, {
        expand: ['charges.data.balance_transaction']
      });

      const receipts = await Promise.all(
        paymentIntent.charges.data.map(charge => this.createReceiptFromCharge(charge))
      );

      logger.info('Listed receipts for payment', {
        paymentId,
        count: receipts.length
      });

      return receipts;
    } catch (error) {
      logger.error('Failed to list receipts', { error, paymentId });
      throw new ApiError(
        'Failed to list receipts',
        'RECEIPT_LIST_ERROR'
      );
    }
  }

  async sendReceiptByEmail(receiptId: string, email: string): Promise<void> {
    try {
      await this.stripe.charges.update(receiptId, {
        receipt_email: email
      });

      logger.info('Sent receipt by email', {
        receiptId,
        email
      });
    } catch (error) {
      logger.error('Failed to send receipt by email', { error, receiptId, email });
      throw new ApiError(
        'Failed to send receipt by email',
        'RECEIPT_EMAIL_ERROR'
      );
    }
  }

  private async createReceiptFromCharge(charge: Stripe.Charge): Promise<Receipt> {
    const balanceTransaction = charge.balance_transaction as Stripe.BalanceTransaction;
    
    return {
      id: charge.id,
      paymentId: charge.payment_intent as string,
      url: charge.receipt_url || undefined,
      pdfUrl: charge.receipt_url ? `${charge.receipt_url}.pdf` : undefined,
      createdAt: new Date(charge.created * 1000),
      metadata: {
        amount: charge.amount,
        currency: charge.currency,
        description: charge.description,
        email: charge.receipt_email,
        number: charge.receipt_number,
        paymentMethod: charge.payment_method_details?.type,
        fees: balanceTransaction ? {
          amount: balanceTransaction.fee,
          details: balanceTransaction.fee_details.map(fee => ({
            type: fee.type,
            amount: fee.amount,
            description: fee.description
          }))
        } : undefined,
        ...charge.metadata
      }
    };
  }
} 