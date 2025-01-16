// Add shared middleware for common validations
export const validateMethod = (method: string) => (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (req.method !== method) {
    return res.status(405).json({
      error: {
        message: 'Method not allowed',
        code: 'METHOD_NOT_ALLOWED'
      }
    });
  }
  next();
}; 