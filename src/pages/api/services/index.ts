import { NextApiRequest, NextApiResponse } from 'next';
import { ServiceService } from '../../../services/serviceService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const createServiceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  usual_price: z.number().positive().optional(),
  duration_minutes: z.number().positive(),
  padding_before_minutes: z.number().min(0).optional(),
  padding_after_minutes: z.number().min(0).optional(),
  is_active: z.boolean().optional()
});

const serviceService = new ServiceService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const includeInactive = req.user.role === 'admin' && req.query.includeInactive === 'true';
        const services = await serviceService.listServices(includeInactive);
        return res.status(200).json(createApiResponse(services));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    case 'POST':
      if (req.user.role !== 'admin') {
        return res.status(403).json(
          createApiError('Insufficient permissions', 'AUTH_INVALID')
        );
      }

      try {
        const validatedData = createServiceSchema.parse(req.body);
        const service = await serviceService.createService(validatedData);
        return res.status(201).json(createApiResponse(service));
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