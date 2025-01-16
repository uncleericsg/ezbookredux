import { stripeService } from './stripeService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';
import type { PaymentIntent } from 'stripe';

export class ReceiptService {
  async generateReceipt(paymentIntentId: string) {
    try {
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      
      if (!paymentIntent.charges.data[0]?.receipt_url) {
        throw new ApiError('Receipt not available', 'RECEIPT_ERROR');
      }

      logger.info('Receipt generated', { paymentIntentId });
      return paymentIntent.charges.data[0].receipt_url;
    } catch (error) {
      logger.error('Failed to generate receipt', { error, paymentIntentId });
      throw error instanceof ApiError ? error : new ApiError('Failed to generate receipt', 'RECEIPT_ERROR');
    }
  }

  async getReceiptById(paymentIntentId: string) {
    try {
      const paymentIntent = await stripeService.retrievePaymentIntent(paymentIntentId);
      return this.formatReceiptData(paymentIntent);
    } catch (error) {
      logger.error('Failed to get receipt', { error, paymentIntentId });
      throw error instanceof ApiError ? error : new ApiError('Failed to get receipt', 'RECEIPT_ERROR');
    }
  }

  private formatReceiptData(paymentIntent: PaymentIntent) {
    const charge = paymentIntent.charges.data[0];
    if (!charge) {
      throw new ApiError('No charge found for payment', 'RECEIPT_ERROR');
    }

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: new Date(paymentIntent.created * 1000).toISOString(),
      receipt_url: charge.receipt_url,
      receipt_number: charge.receipt_number,
      payment_method: charge.payment_method_details?.type,
      billing_details: charge.billing_details,
      metadata: paymentIntent.metadata
    };
  }
}

export const receiptService = new ReceiptService(); 