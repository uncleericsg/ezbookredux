import { NextApiRequest, NextApiResponse } from 'next';
import { ProfileService } from '../../../services/profileService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import { z } from 'zod';

const updateProfileSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone_number: z.string().min(8).optional(),
  avatar_url: z.string().url().nullable().optional()
});

const profileService = new ProfileService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      try {
        const profile = await profileService.getProfile(req.user.id);
        return res.status(200).json(createApiResponse(profile));
      } catch (error) {
        return errorHandler(error, req, res);
      }

    case 'PUT':
      try {
        const validatedData = updateProfileSchema.parse(req.body);
        const profile = await profileService.updateProfile(req.user.id, validatedData);
        return res.status(200).json(createApiResponse(profile));
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