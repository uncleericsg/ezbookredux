export const ApiErrorCode = {
  NOT_FOUND: 'NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  STRIPE_ERROR: 'STRIPE_ERROR',
  STRIPE_WEBHOOK_ERROR: 'STRIPE_WEBHOOK_ERROR',
  STRIPE_PAYMENT_INTENT_ERROR: 'STRIPE_PAYMENT_INTENT_ERROR',
  STRIPE_STATUS_UPDATE_ERROR: 'STRIPE_STATUS_UPDATE_ERROR'
} as const;

export type ApiErrorCode = typeof ApiErrorCode[keyof typeof ApiErrorCode];

export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public statusCode: number = getStatusCode(code)
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getStatusCode(code: ApiErrorCode): number {
  switch (code) {
    case ApiErrorCode.NOT_FOUND:
      return 404;
    case ApiErrorCode.VALIDATION_ERROR:
      return 400;
    case ApiErrorCode.UNAUTHORIZED:
      return 401;
    case ApiErrorCode.FORBIDDEN:
      return 403;
    case ApiErrorCode.DATABASE_ERROR:
    case ApiErrorCode.SERVER_ERROR:
    case ApiErrorCode.STRIPE_ERROR:
    case ApiErrorCode.STRIPE_WEBHOOK_ERROR:
    case ApiErrorCode.STRIPE_PAYMENT_INTENT_ERROR:
    case ApiErrorCode.STRIPE_STATUS_UPDATE_ERROR:
      return 500;
    default:
      return 500;
  }
}