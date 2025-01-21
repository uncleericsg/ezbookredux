import { supabaseAdmin } from '@server/config/supabase/client';
import { logger } from '@server/utils/logger';
import { ApiError } from '@server/utils/apiErrors';
import type { 
  PaymentSession, 
  PaymentStatus,
  DatabasePaymentSession,
  PaymentRepository
} from '@shared/types/payment';

export class PaymentSessionRepository implements PaymentRepository {
  async createSession(
    data: Omit<PaymentSession, 'id' | 'created_at' | 'updated_at'>
  ): Promise<PaymentSession> {
    try {
      logger.info('Creating payment session', { data });

      const now = new Date().toISOString();

      const { data: session, error } = await supabaseAdmin
        .from('payment_sessions')
        .insert({
          booking_id: data.booking_id,
          user_id: data.user_id,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          stripe_session_id: data.stripe_session_id,
          created_at: now,
          updated_at: now
        })
        .select()
        .single();

      if (error) {
        logger.error('Database error creating payment session', { error });
        throw new ApiError('Failed to create payment session', 'DATABASE_ERROR');
      }

      if (!session) {
        logger.error('No session returned after creation');
        throw new ApiError('Failed to create payment session', 'DATABASE_ERROR');
      }

      logger.info('Payment session created', { sessionId: session.id });
      return this.mapSession(session as DatabasePaymentSession);
    } catch (error) {
      logger.error('Failed to create payment session', { error: String(error) });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to create payment session', 'DATABASE_ERROR');
    }
  }

  async updateSessionStatus(sessionId: string, status: PaymentStatus): Promise<void> {
    try {
      logger.info('Updating payment session status', { sessionId, status });

      const { error } = await supabaseAdmin
        .from('payment_sessions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_session_id', sessionId);

      if (error) {
        logger.error('Database error updating payment session status', { error });
        throw new ApiError('Failed to update payment session status', 'DATABASE_ERROR');
      }

      logger.info('Payment session status updated', { sessionId, status });
    } catch (error) {
      logger.error('Failed to update payment session status', { error: String(error) });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to update payment session status', 'DATABASE_ERROR');
    }
  }

  async getSession(sessionId: string): Promise<PaymentSession> {
    try {
      logger.info('Fetching payment session', { sessionId });

      const { data: session, error } = await supabaseAdmin
        .from('payment_sessions')
        .select()
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) {
        logger.error('Database error fetching payment session', { error });
        throw new ApiError('Failed to fetch payment session', 'DATABASE_ERROR');
      }

      if (!session) {
        logger.warn('Payment session not found', { sessionId });
        throw new ApiError('Payment session not found', 'NOT_FOUND');
      }

      logger.info('Payment session fetched', { sessionId });
      return this.mapSession(session as DatabasePaymentSession);
    } catch (error) {
      logger.error('Failed to fetch payment session', { error: String(error) });
      if (error instanceof ApiError) throw error;
      throw new ApiError('Failed to fetch payment session', 'DATABASE_ERROR');
    }
  }

  private mapSession(session: DatabasePaymentSession): PaymentSession {
    return {
      id: session.id,
      booking_id: session.booking_id,
      user_id: session.user_id,
      amount: session.amount,
      currency: session.currency,
      status: session.status,
      stripe_session_id: session.stripe_session_id,
      created_at: session.created_at,
      updated_at: session.updated_at
    };
  }
}
