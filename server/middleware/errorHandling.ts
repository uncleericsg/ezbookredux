import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError, isApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';

export interface ErrorHandlerConfig {
  logErrors?: boolean;
  includeErrorDetails?: boolean;
}

const defaultConfig: ErrorHandlerConfig = {
  logErrors: true,
  includeErrorDetails: process.env.NODE_ENV !== 'production'
};

export function errorHandler(config: ErrorHandlerConfig = defaultConfig) {
  return async function handleError(
    error: unknown,
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const apiError = isApiError(error) ? error : ApiError.fromError(error);
    const { statusCode, code, message, details } = apiError;

    // Log the error if configured to do so
    if (config.logErrors) {
      const logMetadata = {
        error,
        errorDetails: details,
        requestInfo: {
          method: req.method,
          url: req.url,
          query: req.query,
          headers: req.headers,
          body: req.body
        }
      };

      if (statusCode >= 500) {
        logger.error('Server error occurred', logMetadata);
      } else {
        logger.warn('Client error occurred', logMetadata);
      }
    }

    // Prepare the error response
    const errorResponse = {
      error: {
        code,
        message,
        ...(config.includeErrorDetails && details && { details })
      }
    };

    // Send the error response
    res.status(statusCode).json(errorResponse);
  };
}

export function withErrorHandling(handler: Function, config?: ErrorHandlerConfig) {
  return async function wrappedHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handler(req, res);
    } catch (error) {
      await errorHandler(config)(error, req, res);
    }
  };
}

export function handleApiErrors(handler: Function) {
  return async function wrappedHandler(req: NextApiRequest, res: NextApiResponse) {
    try {
      // Check if response has already been sent
      if (res.writableEnded) {
        return;
      }

      await handler(req, res);

      // Check if handler didn't send a response
      if (!res.writableEnded) {
        throw new ApiError('No response sent from handler', 'INTERNAL_SERVER_ERROR');
      }
    } catch (error) {
      // Check if response has already been sent
      if (res.writableEnded) {
        logger.error('Error occurred after response was sent', { error });
        return;
      }

      await errorHandler()(error, req, res);
    }
  };
}

export function validateRequest(schema: any) {
  return async function validate(req: NextApiRequest, res: NextApiResponse, next: Function) {
    try {
      const { body, query, params } = req;
      
      if (schema.body) {
        await schema.body.validateAsync(body, { abortEarly: false });
      }
      
      if (schema.query) {
        await schema.query.validateAsync(query, { abortEarly: false });
      }
      
      if (schema.params) {
        await schema.params.validateAsync(params, { abortEarly: false });
      }

      return next();
    } catch (error) {
      throw new ApiError(
        'Request validation failed',
        'VALIDATION_ERROR',
        { originalError: error }
      );
    }
  };
}

export function notFoundHandler() {
  return function handle404(req: NextApiRequest, res: NextApiResponse) {
    throw new ApiError(
      `Cannot ${req.method} ${req.url}`,
      'NOT_FOUND'
    );
  };
}

export function methodNotAllowedHandler(allowedMethods: string[]) {
  return function handle405(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Allow', allowedMethods);
    throw new ApiError(
      `Method ${req.method} not allowed`,
      'BAD_REQUEST'
    );
  };
} 