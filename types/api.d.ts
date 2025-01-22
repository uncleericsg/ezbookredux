import type { DatabaseError, ErrorCode, ValidationError } from '../shared/types/error';
export interface ServiceResponse<T> {
    data: T | null;
    error?: ServiceError;
    status: 'success' | 'error';
    metadata: {
        timestamp: number;
        requestId: string;
        path?: string;
    };
}
export interface ServiceError {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
}
export interface DatabaseResponse<T> {
    data: T | null;
    error: DatabaseError | null;
}
export type AsyncServiceResponse<T> = Promise<ServiceResponse<T>>;
export declare const createServiceHandler: <T>() => (promise: Promise<T>, context?: {
    path?: string;
}) => AsyncServiceResponse<T>;
export declare const isServiceError: (response: ServiceResponse<unknown>) => response is ServiceResponse<never> & {
    error: ServiceError;
};
export declare const isServiceSuccess: <T>(response: ServiceResponse<T>) => response is ServiceResponse<T> & {
    data: T;
};
export declare const getErrorDetails: (error: ServiceError) => Record<string, unknown>;
export declare const createErrorResponse: <T>(code: ErrorCode, message: string, details?: Record<string, unknown>) => ServiceResponse<T>;
export declare const createValidationErrorResponse: <T>(errors: ValidationError[]) => ServiceResponse<T>;
//# sourceMappingURL=api.d.ts.map