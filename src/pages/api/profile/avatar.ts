import { NextApiRequest, NextApiResponse } from 'next';
import { ProfileService } from '../../../services/profileService';
import { createApiResponse, createApiError } from '../../../utils/apiResponse';
import { errorHandler } from '../../../middleware/errorHandler';
import { withAuth, AuthenticatedRequest } from '../../../middleware/authMiddleware';
import formidable from 'formidable';
import { createReadStream } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const profileService = new ProfileService();

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json(
      createApiError('Method not allowed', 'VALIDATION_ERROR')
    );
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    if (!files.avatar?.[0]) {
      return res.status(400).json(
        createApiError('No avatar file provided', 'VALIDATION_ERROR')
      );
    }

    const file = files.avatar[0];
    
    // Validate file type
    if (!file.mimetype?.startsWith('image/')) {
      return res.status(400).json(
        createApiError('Invalid file type. Only images are allowed', 'VALIDATION_ERROR')
      );
    }

    // Convert to File object
    const fileStream = createReadStream(file.filepath);
    const buffer = await streamToBuffer(fileStream);
    const avatarFile = new File([buffer], file.originalFilename || 'avatar', {
      type: file.mimetype
    });

    const avatarUrl = await profileService.updateAvatar(req.user.id, avatarFile);
    
    return res.status(200).json(createApiResponse({ avatar_url: avatarUrl }));
  } catch (error) {
    return errorHandler(error, req, res);
  }
}

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export default withAuth(handler); 