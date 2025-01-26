import Stripe from 'stripe';
import { STRIPE_CHECKOUT } from '@/constants/payment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CreateCheckoutSessionParams {
  bookingId: string;
  userId: string;
  amount: number;
  description: string;
  customerEmail: string;
}

export async function createCheckoutSession({
  bookingId,
  userId,
  amount,
  description,
  customerEmail,
}: CreateCheckoutSessionParams) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: STRIPE_CHECKOUT.MODE,
      currency: STRIPE_CHECKOUT.CURRENCY,
      success_url: STRIPE_CHECKOUT.SUCCESS_URL,
      cancel_url: STRIPE_CHECKOUT.CANCEL_URL,
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: STRIPE_CHECKOUT.CURRENCY,
            product_data: {
              name: 'Aircon Service Booking',
              description,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId,
        userId,
      },
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url!,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function handleCheckoutSuccess(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      bookingId: session.metadata?.bookingId,
      userId: session.metadata?.userId,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
    };
  } catch (error) {
    console.error('Error handling checkout success:', error);
    throw error;
  }
} 