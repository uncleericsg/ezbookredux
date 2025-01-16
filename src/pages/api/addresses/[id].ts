import { NextApiRequest, NextApiResponse } from 'next';
import { AddressService } from '../../../services/addressService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const updateAddressSchema = z.object({
  block_street: z.string().min(1).optional(),
  floor_unit: z.string().min(1).optional(),
  postal_code: z.string().min(6).max(6).optional(),
  is_default: z.boolean().optional()
});

const addressService = new AddressService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json(
      createApiError('Invalid address ID', 'VALIDATION_ERROR')
    );
  }

  switch (req.method) {
    case 'PUT':
      try {
        const validatedData = updateAddressSchema.parse(req.body);
        const address = await addressService.updateAddress(req.user.id, id, validatedData);
        return res.status(200).json(createApiResponse(address));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    case 'DELETE':
      try {
        await addressService.deleteAddress(req.user.id, id);
        return res.status(204).end();
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