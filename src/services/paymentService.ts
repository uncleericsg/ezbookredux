import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';
import type { Database } from '@/types/database';
import type { PaymentDetails, PaymentStatus } from '@/types/payment';
import { handleUnknownError } from '@/utils/errorHandling';

const supabase = createClient<Database>(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);

export interface CreatePaymentParams {
  amount: number;
  serviceId: string;
  bookingId: string;
  tipAmount?: number;
  currency?: string;
  customerId: string;
}

export async function createPayment(params: CreatePaymentParams): Promise<PaymentDetails> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        amount: params.amount,
        service_id: params.serviceId,
        booking_id: params.bookingId,
        tip_amount: params.tipAmount || 0,
        currency: params.currency || 'SGD',
        customer_id: params.customerId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function getPaymentByBookingId(bookingId: string): Promise<PaymentDetails | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus
): Promise<void> {
  try {
    const { error } = await supabase
      .from('payments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', paymentId);

    if (error) throw error;
  } catch (error) {
    throw handleUnknownError(error);
  }
}

export async function getPaymentsByCustomerId(customerId: string): Promise<PaymentDetails[]> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw handleUnknownError(error);
  }
}
