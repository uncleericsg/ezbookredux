import type { NextApiRequest, NextApiResponse } from 'next';
import { getReceiptById } from '@/server/services/stripe/receiptService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ error: 'Invalid receipt ID' });
    }

    const receipt = await getReceiptById(id);
    res.status(200).json(receipt);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || 'Failed to retrieve receipt'
    });
  }
} 