import { createClient } from '@supabase/supabase-js';
import { Payment, CreatePaymentIntentRequest, PaymentStatus, PaymentDetailsResponse, PaymentListResponse, RefundRequest } from '../types/payment';
import { createApiError } from '../utils/apiResponse';
import { Database } from '../types/supabase';
import Stripe from 'stripe';

export class PaymentService {
  private supabase;
  private stripe;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    if (!stripeSecretKey) {
      throw new Error('Missing Stripe secret key');
    }

    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentIntent(data: CreatePaymentIntentRequest): Promise<{
    clientSecret: string;
    intentId: string;
  }> {
    try {
      // Verify booking exists and hasn't been paid
      const { data: booking, error: bookingError } = await this.supabase
        .from('bookings')
        .select('id, payment_status, total_amount')
        .eq('id', data.booking_id)
        .single();

      if (bookingError || !booking) {
        throw createApiError('Booking not found', 'NOT_FOUND');
      }

      if (booking.payment_status === 'succeeded') {
        throw createApiError('Booking has already been paid', 'VALIDATION_ERROR');
      }

      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: data.currency || 'sgd',
        metadata: {
          booking_id: data.booking_id,
          ...data.metadata
        }
      });

      // Create payment record
      const { error: paymentError } = await this.supabase
        .from('payments')
        .insert({
          booking_id: data.booking_id,
          amount: data.amount,
          currency: data.currency || 'sgd',
          status: 'pending',
          payment_intent_id: paymentIntent.id
        });

      if (paymentError) {
        throw paymentError;
      }

      return {
        clientSecret: paymentIntent.client_secret!,
        intentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw createApiError('Failed to create payment intent', 'SERVER_ERROR');
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentDetailsResponse> {
    try {
      const { data: payment, error } = await this.supabase
        .from('payments')
        .select(`
          *,
          booking:bookings(
            id,
            reference:id,
            service:services(
              title
            )
          )
        `)
        .eq('id', paymentId)
        .single();

      if (error) throw error;
      if (!payment) throw createApiError('Payment not found', 'NOT_FOUND');

      // Get refunds from Stripe
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        payment.payment_intent_id,
        {
          expand: ['charges.refunds']
        }
      );

      const charge = paymentIntent.charges.data[0];
      const refunds = charge?.refunds?.data.map(refund => ({
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        created_at: new Date(refund.created * 1000).toISOString()
      })) || [];

      return {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        payment_intent_id: payment.payment_intent_id,
        created_at: payment.created_at,
        refunded_amount: charge?.amount_refunded || 0,
        booking: {
          id: payment.booking.id,
          reference: payment.booking.reference,
          service: {
            title: payment.booking.service.title
          }
        },
        refunds
      };
    } catch (error) {
      console.error('Get payment details error:', error);
      throw createApiError('Failed to fetch payment details', 'SERVER_ERROR');
    }
  }

  async listPayments(userId: string): Promise<PaymentListResponse[]> {
    try {
      const { data, error } = await this.supabase
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          status,
          created_at,
          booking:bookings(id)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at,
        booking_reference: `BK-${payment.booking.id.slice(0, 8)}`
      }));
    } catch (error) {
      console.error('List payments error:', error);
      throw createApiError('Failed to fetch payments', 'SERVER_ERROR');
    }
  }

  async refundPayment(paymentId: string, data: RefundRequest): Promise<void> {
    try {
      // Get payment details
      const { data: payment, error } = await this.supabase
        .from('payments')
        .select('payment_intent_id, amount, status')
        .eq('id', paymentId)
        .single();

      if (error || !payment) {
        throw createApiError('Payment not found', 'NOT_FOUND');
      }

      if (payment.status !== 'succeeded') {
        throw createApiError('Payment cannot be refunded', 'VALIDATION_ERROR');
      }

      // Process refund through Stripe
      const paymentIntent = await this.stripe.paymentIntents.retrieve(payment.payment_intent_id);
      const charge = paymentIntent.charges.data[0];

      await this.stripe.refunds.create({
        charge: charge.id,
        amount: data.amount,
        reason: data.reason as Stripe.RefundCreateParams.Reason
      });

      // Update payment status
      await this.supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', paymentId);

    } catch (error) {
      console.error('Refund payment error:', error);
      throw createApiError('Failed to process refund', 'SERVER_ERROR');
    }
  }
}
