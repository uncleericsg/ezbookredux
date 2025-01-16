import type { NextApiRequest, NextApiResponse } from 'next';
import { generateReceipt } from '@/server/services/stripe/receiptService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    const pdfBuffer = await generateReceipt(paymentIntentId);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${paymentIntentId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message || 'Failed to generate receipt'
    });
  }
} 