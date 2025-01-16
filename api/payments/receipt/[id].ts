import type { NextApiRequest, NextApiResponse } from 'next';
import { paymentService } from '@/server/services/payments/paymentService';
import { logger } from '@/server/utils/logger';
import { ApiError } from '@/server/utils/apiErrors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED'
      }
    });
  }

  try {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      throw new ApiError('Invalid receipt ID', 'VALIDATION_ERROR');
    }

    const receipt = await paymentService.getReceiptById(id);
    
    logger.info('Receipt retrieved successfully', { receiptId: id });
    res.status(200).json(receipt);
  } catch (error) {
    logger.error('Failed to retrieve receipt', { error });
    
    if (error instanceof ApiError) {
      return res.status(400).json({
        error: {
          message: error.message,
          code: error.code
        }
      });
    }

    return res.status(500).json({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      }
    });
  }
} 