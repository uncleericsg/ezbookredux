import { NextApiRequest, NextApiResponse } from 'next';
import { createApiError } from '../utils/apiResponse';

export function errorHandler(error: any, req: NextApiRequest, res: NextApiResponse) {
  console.error(error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json(
      createApiError('Validation error', 'VALIDATION_ERROR', error.details)
    );
  }
  
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json(
      createApiError('Authentication required', 'AUTH_REQUIRED')
    );
  }
  
  return res.status(500).json(
    createApiError('Internal server error', 'SERVER_ERROR')
  );
} 