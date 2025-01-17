/**
 * Shared error types used across client and server
 */

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export type ErrorResponse = {
  error: ApiError;
  validationErrors?: ValidationError[];
};
