import { NextApiRequest, NextApiResponse } from 'next';
import { createCheckoutSession } from '@/server/services/stripe/checkoutService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, userId, amount, description, customerEmail } = req.body;

    // Basic validation
    if (!bookingId || !userId || !amount || !description || !customerEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = await createCheckoutSession({
      bookingId,
      userId,
      amount,
      description,
      customerEmail,
    });

    res.status(200).json(session);
  } catch (error) {
    console.error('Checkout session creation error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
} 