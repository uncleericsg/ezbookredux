import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { PaymentService } from '@services/payments/PaymentService';
import type { AppError } from '@shared/types/error';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CheckoutRequest {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, amount, currency, customerEmail } = req.body as CheckoutRequest;

    // Validate input
    if (!bookingId || !amount || !currency || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: 'Appointment Booking',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}/cancel`,
      customer_email: customerEmail,
      metadata: {
        bookingId,
      },
    });

    // Save payment session to database
    await PaymentService.createPaymentSession({
      bookingId,
      amount,
      currency,
      stripeSessionId: session.id,
      status: 'pending',
    });

    return res.status(200).json({ checkoutUrl: session.url });
  } catch (error) {
    const apiError = error as ApiError;
    return res.status(500).json({ 
      error: 'Payment processing failed',
      message: apiError.message,
      code: apiError.code
    });
  }
}