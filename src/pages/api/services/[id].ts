import { NextApiRequest, NextApiResponse } from 'next';
import { ServiceService } from '../../../services/serviceService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const updateServiceSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  price: z.number().positive().optional(),
  usual_price: z.number().positive().nullable().optional(),
  duration_minutes: z.number().positive().optional(),
  padding_before_minutes: z.number().min(0).optional(),
  padding_after_minutes: z.number().min(0).optional(),
  is_active: z.boolean().optional()
});

const serviceService = new ServiceService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      createApiError('Invalid service ID', 'VALIDATION_ERROR')
    );
  }

  switch (req.method) {
    case 'GET':
      try {
        const service = await serviceService.getService(id);
        return res.status(200).json(createApiResponse(service));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    case 'PUT':
      if (req.user.role !== 'admin') {
        return res.status(403).json(
          createApiError('Insufficient permissions', 'AUTH_INVALID')
        );
      }

      try {
        const validatedData = updateServiceSchema.parse(req.body);
        const service = await serviceService.updateService(id, validatedData);
        return res.status(200).json(createApiResponse(service));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    default:
      return res.status(405).json(
        createApiError('Method not allowed', 'VALIDATION_ERROR')
      );
  }
}

export default withAuth(handler); 