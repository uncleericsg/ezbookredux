import { NextApiRequest, NextApiResponse } from 'next';
import { handleCheckoutSuccess } from '@/server/services/stripe/checkoutService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Missing session ID' });
    }

    const result = await handleCheckoutSuccess(session_id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Payment success handling error:', error);
    res.status(500).json({ error: 'Failed to process payment success' });
  }
} 