import { BaseError } from '../shared/types/error';
export const createServiceHandler = () => {
    return async (promise, context) => {
        const requestId = crypto.randomUUID();
        const metadata = {
            timestamp: Date.now(),
            requestId,
            path: context?.path
        };
        try {
            const data = await promise;
            return {
                data,
                status: 'success',
                metadata
            };
        }
        catch (err) {
            // Handle known error types
            if (err instanceof BaseError) {
                return {
                    data: null,
                    error: {
                        code: err.code,
                        message: err.message,
                        details: err.details
                    },
                    status: 'error',
                    metadata
                };
            }
            // Handle unknown errors
            return {
                data: null,
                error: {
                    code: 'UNKNOWN_ERROR',
                    message: err instanceof Error ? err.message : 'Unknown error occurred',
                    details: err instanceof Error ? {
                        name: err.name,
                        stack: err.stack,
                        cause: err.cause
                    } : undefined
                },
                status: 'error',
                metadata
            };
        }
    };
};
// Enhanced type guards with specific error checking
export const isServiceError = (response) => {
    return response.status === 'error' && response.error !== undefined;
};
export const isServiceSuccess = (response) => {
    return response.status === 'success' && response.data !== null;
};
// Helper to extract error details for logging
export const getErrorDetails = (error) => {
    return {
        code: error.code,
        message: error.message,
        ...error.details
    };
};
// Helper to create typed error responses
export const createErrorResponse = (code, message, details) => {
    return {
        data: null,
        error: {
            code,
            message,
            details
        },
        status: 'error',
        metadata: {
            timestamp: Date.now(),
            requestId: crypto.randomUUID()
        }
    };
};
// Helper to handle validation errors
export const createValidationErrorResponse = (errors) => {
    return createErrorResponse('VALIDATION_ERROR', 'Validation failed', { errors });
};
//# sourceMappingURL=api.js.map