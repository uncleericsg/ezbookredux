import { NextApiRequest, NextApiResponse } from 'next';
import { errorHandler } from '@server/utils/errorHandler';
import { createPaymentIntent } from '@server/services/stripe/paymentService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const { amount, currency = 'sgd', metadata = {} } = req.body;

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return errorHandler(error, req, res);
  }
}