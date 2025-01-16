import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../../../types/supabase';
import { PaymentStatus } from '../../../types/payment';

// Disable body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function updatePaymentStatus(
  paymentIntentId: string, 
  status: PaymentStatus
) {
  const { error: paymentError } = await supabase
    .from('payments')
    .update({ status })
    .eq('payment_intent_id', paymentIntentId);

  if (paymentError) throw paymentError;

  // If payment succeeded, update booking payment status
  if (status === 'succeeded') {
    const { data: payment } = await supabase
      .from('payments')
      .select('booking_id')
      .eq('payment_intent_id', paymentIntentId)
      .single();

    if (payment) {
      await supabase
        .from('bookings')
        .update({ payment_status: 'succeeded' })
        .eq('id', payment.booking_id);
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await updatePaymentStatus(
          event.data.object.id,
          'succeeded'
        );
        break;

      case 'payment_intent.payment_failed':
        await updatePaymentStatus(
          event.data.object.id,
          'failed'
        );
        break;

      case 'payment_intent.canceled':
        await updatePaymentStatus(
          event.data.object.id,
          'failed'
        );
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
} 