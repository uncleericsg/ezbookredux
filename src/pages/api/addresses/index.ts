import { NextApiRequest, NextApiResponse } from 'next';
import { AddressService } from '../../../services/addressService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const createAddressSchema = z.object({
  block_street: z.string().min(1),
  floor_unit: z.string().min(1),
  postal_code: z.string().min(6).max(6),
  is_default: z.boolean().optional()
});

const addressService = new AddressService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const addresses = await addressService.listAddresses(req.user.id);
        return res.status(200).json(createApiResponse(addresses));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    case 'POST':
      try {
        const validatedData = createAddressSchema.parse(req.body);
        const address = await addressService.createAddress(req.user.id, validatedData);
        return res.status(201).json(createApiResponse(address));
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