export interface DatabaseError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface AppError extends Error {
  code: string;
  details?: Record<string, unknown>;
  isOperational: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
  stack?: string;
}
