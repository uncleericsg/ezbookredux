import { supabase } from '@server/utils/supabase';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';

export interface PaymentSession {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'expired' | 'failed';
  stripeSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PaymentSessionRepository {
  async createSession(data: Omit<PaymentSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaymentSession> {
    try {
      const { data: session, error } = await supabase
        .from('payment_sessions')
        .insert([{
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      if (!session) throw new Error('Failed to create payment session');

      logger.info('Created payment session', { sessionId: session.id });
      return this.mapSession(session);
    } catch (error) {
      logger.error('Failed to create payment session', { error });
      throw new ApiError(
        'Failed to create payment session',
        'DATABASE_ERROR'
      );
    }
  }

  async updateSessionStatus(stripeSessionId: string, status: PaymentSession['status']): Promise<void> {
    try {
      const { error } = await supabase
        .from('payment_sessions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', stripeSessionId);

      if (error) throw error;

      logger.info('Updated payment session status', { stripeSessionId, status });
    } catch (error) {
      logger.error('Failed to update payment session', { error });
      throw new ApiError(
        'Failed to update payment session',
        'DATABASE_ERROR'
      );
    }
  }

  async getSessionByStripeId(stripeSessionId: string): Promise<PaymentSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('payment_sessions')
        .select()
        .eq('stripe_session_id', stripeSessionId)
        .single();

      if (error) throw error;
      if (!session) return null;

      return this.mapSession(session);
    } catch (error) {
      logger.error('Failed to get payment session', { error });
      throw new ApiError(
        'Failed to get payment session',
        'DATABASE_ERROR'
      );
    }
  }

  async getSessionByBookingId(bookingId: string): Promise<PaymentSession | null> {
    try {
      const { data: session, error } = await supabase
        .from('payment_sessions')
        .select()
        .eq('booking_id', bookingId)
        .single();

      if (error) throw error;
      if (!session) return null;

      return this.mapSession(session);
    } catch (error) {
      logger.error('Failed to get payment session', { error });
      throw new ApiError(
        'Failed to get payment session',
        'DATABASE_ERROR'
      );
    }
  }

  private mapSession(data: any): PaymentSession {
    return {
      id: data.id,
      bookingId: data.booking_id,
      userId: data.user_id,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      stripeSessionId: data.stripe_session_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
} 