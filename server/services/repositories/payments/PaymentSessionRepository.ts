import { supabaseClient } from '@/config/supabase/client';
import { logger } from '@/utils/logger';
import { handleDatabaseError } from '@/utils/apiErrors';

interface PaymentSession {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'expired' | 'failed';
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreatePaymentSessionParams {
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
}

export const PaymentSessionRepository = {
  /**
   * Create a new payment session
   */
  async create(params: CreatePaymentSessionParams): Promise<PaymentSession> {
    try {
      const { data, error } = await supabaseClient
        .from('payment_sessions')
        .insert({
          booking_id: params.bookingId,
          user_id: params.userId,
          amount: params.amount,
          currency: params.currency,
          status: 'pending',
          stripe_session_id: params.stripeSessionId,
        })
        .select()
        .single();

      if (error) {
        logger.error('Error creating payment session:', error);
        throw handleDatabaseError('Failed to create payment session');
      }

      return this.mapPaymentSession(data);
    } catch (error) {
      logger.error('Error in create payment session:', error);
      throw handleDatabaseError('Failed to create payment session');
    }
  },

  /**
   * Update payment session status
   */
  async updateStatus(stripeSessionId: string, status: PaymentSession['status']): Promise<void> {
    try {
      const { error } = await supabaseClient
        .from('payment_sessions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', stripeSessionId);

      if (error) {
        logger.error('Error updating payment session:', error);
        throw handleDatabaseError('Failed to update payment session');
      }
    } catch (error) {
      logger.error('Error in update payment session:', error);
      throw handleDatabaseError('Failed to update payment session');
    }
  },

  /**
   * Get payment session by Stripe session ID
   */
  async getByStripeSessionId(stripeSessionId: string): Promise<PaymentSession | null> {
    try {
      const { data, error } = await supabaseClient
        .from('payment_sessions')
        .select()
        .eq('stripe_session_id', stripeSessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        logger.error('Error fetching payment session:', error);
        throw handleDatabaseError('Failed to fetch payment session');
      }

      return data ? this.mapPaymentSession(data) : null;
    } catch (error) {
      logger.error('Error in get payment session:', error);
      throw handleDatabaseError('Failed to fetch payment session');
    }
  },

  /**
   * Map database record to PaymentSession type
   */
  private mapPaymentSession(data: any): PaymentSession {
    return {
      id: data.id,
      bookingId: data.booking_id,
      userId: data.user_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      stripeSessionId: data.stripe_session_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }
}; 