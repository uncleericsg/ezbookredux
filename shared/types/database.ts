import type { PrismaClient } from '@prisma/client';

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  /**
   * Connection URL
   */
  url: string;

  /**
   * Direct connection URL (for migrations)
   */
  directUrl?: string;

  /**
   * Schema name
   */
  schema?: string;

  /**
   * Prisma client instance
   */
  prisma?: PrismaClient;

  /**
   * Connection pool configuration
   */
  pool?: {
    min: number;
    max: number;
    idleTimeoutMs: number;
  };

  /**
   * SSL configuration
   */
  ssl?: {
    enabled: boolean;
    rejectUnauthorized?: boolean;
    ca?: string;
    cert?: string;
    key?: string;
  };

  /**
   * Statement timeout in milliseconds
   */
  statementTimeout?: number;

  /**
   * Query timeout in milliseconds
   */
  queryTimeout?: number;

  /**
   * Idle timeout in milliseconds
   */
  idleTimeout?: number;

  /**
   * Debug mode
   */
  debug?: boolean;
}

/**
 * Database error codes
 */
export enum DatabaseErrorCode {
  // Connection errors
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  CONNECTION_REFUSED = 'CONNECTION_REFUSED',
  CONNECTION_CLOSED = 'CONNECTION_CLOSED',

  // Query errors
  QUERY_ERROR = 'QUERY_ERROR',
  QUERY_TIMEOUT = 'QUERY_TIMEOUT',
  QUERY_CANCELED = 'QUERY_CANCELED',
  QUERY_SYNTAX_ERROR = 'QUERY_SYNTAX_ERROR',
  QUERY_VALIDATION_ERROR = 'QUERY_VALIDATION_ERROR',
  QUERY_INTERPRETATION_ERROR = 'QUERY_INTERPRETATION_ERROR',
  RAW_QUERY_ERROR = 'RAW_QUERY_ERROR',

  // Data errors
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  CHECK_VIOLATION = 'CHECK_VIOLATION',
  NOT_NULL_VIOLATION = 'NOT_NULL_VIOLATION',
  UNIQUE_VIOLATION = 'UNIQUE_VIOLATION',
  CONSTRAINT_VIOLATION = 'CONSTRAINT_VIOLATION',
  NULL_CONSTRAINT_VIOLATION = 'NULL_CONSTRAINT_VIOLATION',

  // Value errors
  INVALID_VALUE = 'INVALID_VALUE',
  INVALID_FIELD_TYPE = 'INVALID_FIELD_TYPE',
  VALUE_OUT_OF_RANGE = 'VALUE_OUT_OF_RANGE',
  MISSING_REQUIRED_VALUE = 'MISSING_REQUIRED_VALUE',
  MISSING_REQUIRED_ARGUMENT = 'MISSING_REQUIRED_ARGUMENT',
  INCONSISTENT_COLUMN_DATA = 'INCONSISTENT_COLUMN_DATA',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INPUT_ERROR = 'INPUT_ERROR',

  // Relation errors
  RELATION_VIOLATION = 'RELATION_VIOLATION',
  RELATION_NOT_FOUND = 'RELATION_NOT_FOUND',
  CONNECT_OR_CREATE_CONFLICT = 'CONNECT_OR_CREATE_CONFLICT',

  // Transaction errors
  TRANSACTION_ERROR = 'TRANSACTION_ERROR',
  TRANSACTION_TIMEOUT = 'TRANSACTION_TIMEOUT',
  TRANSACTION_API_ERROR = 'TRANSACTION_API_ERROR',
  NESTED_TRANSACTION_ERROR = 'NESTED_TRANSACTION_ERROR',
  SERIALIZATION_FAILURE = 'SERIALIZATION_FAILURE',
  DEADLOCK_DETECTED = 'DEADLOCK_DETECTED',

  // Schema errors
  SCHEMA_ERROR = 'SCHEMA_ERROR',
  UNDEFINED_COLUMN = 'UNDEFINED_COLUMN',
  UNDEFINED_TABLE = 'UNDEFINED_TABLE',
  UNDEFINED_FUNCTION = 'UNDEFINED_FUNCTION',
  TABLE_NOT_FOUND = 'TABLE_NOT_FOUND',
  COLUMN_NOT_FOUND = 'COLUMN_NOT_FOUND',

  // System errors
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OUT_OF_MEMORY = 'OUT_OF_MEMORY',
  DISK_FULL = 'DISK_FULL',
  UNSUPPORTED_FEATURE = 'UNSUPPORTED_FEATURE',
  MULTIPLE_ERRORS = 'MULTIPLE_ERRORS',
  FULL_TEXT_SEARCH_ERROR = 'FULL_TEXT_SEARCH_ERROR'
}

/**
 * Database error mapping
 */
export const DATABASE_ERROR_MAPPING: Record<string, DatabaseErrorCode> = {
  // Prisma error codes
  P2000: DatabaseErrorCode.QUERY_ERROR,
  P2001: DatabaseErrorCode.RECORD_NOT_FOUND,
  P2002: DatabaseErrorCode.UNIQUE_VIOLATION,
  P2003: DatabaseErrorCode.FOREIGN_KEY_VIOLATION,
  P2004: DatabaseErrorCode.CONSTRAINT_VIOLATION,
  P2005: DatabaseErrorCode.INVALID_FIELD_TYPE,
  P2006: DatabaseErrorCode.INVALID_VALUE,
  P2007: DatabaseErrorCode.VALIDATION_ERROR,
  P2008: DatabaseErrorCode.QUERY_SYNTAX_ERROR,
  P2009: DatabaseErrorCode.QUERY_VALIDATION_ERROR,
  P2010: DatabaseErrorCode.RAW_QUERY_ERROR,
  P2011: DatabaseErrorCode.NULL_CONSTRAINT_VIOLATION,
  P2012: DatabaseErrorCode.MISSING_REQUIRED_VALUE,
  P2013: DatabaseErrorCode.MISSING_REQUIRED_ARGUMENT,
  P2014: DatabaseErrorCode.RELATION_VIOLATION,
  P2015: DatabaseErrorCode.RECORD_NOT_FOUND,
  P2016: DatabaseErrorCode.QUERY_INTERPRETATION_ERROR,
  P2017: DatabaseErrorCode.RELATION_NOT_FOUND,
  P2018: DatabaseErrorCode.CONNECT_OR_CREATE_CONFLICT,
  P2019: DatabaseErrorCode.INPUT_ERROR,
  P2020: DatabaseErrorCode.VALUE_OUT_OF_RANGE,
  P2021: DatabaseErrorCode.TABLE_NOT_FOUND,
  P2022: DatabaseErrorCode.COLUMN_NOT_FOUND,
  P2023: DatabaseErrorCode.INCONSISTENT_COLUMN_DATA,
  P2024: DatabaseErrorCode.CONNECTION_TIMEOUT,
  P2025: DatabaseErrorCode.RECORD_NOT_FOUND,
  P2026: DatabaseErrorCode.UNSUPPORTED_FEATURE,
  P2027: DatabaseErrorCode.MULTIPLE_ERRORS,
  P2028: DatabaseErrorCode.TRANSACTION_ERROR,
  P2030: DatabaseErrorCode.FULL_TEXT_SEARCH_ERROR,
  P2031: DatabaseErrorCode.TRANSACTION_API_ERROR,
  P2033: DatabaseErrorCode.NESTED_TRANSACTION_ERROR,
  P2034: DatabaseErrorCode.TRANSACTION_TIMEOUT,

  // PostgreSQL error codes
  '23502': DatabaseErrorCode.NOT_NULL_VIOLATION,
  '23503': DatabaseErrorCode.FOREIGN_KEY_VIOLATION,
  '23505': DatabaseErrorCode.UNIQUE_VIOLATION,
  '23514': DatabaseErrorCode.CHECK_VIOLATION,
  '40001': DatabaseErrorCode.SERIALIZATION_FAILURE,
  '40P01': DatabaseErrorCode.DEADLOCK_DETECTED,
  '42601': DatabaseErrorCode.QUERY_SYNTAX_ERROR,
  '42703': DatabaseErrorCode.UNDEFINED_COLUMN,
  '42P01': DatabaseErrorCode.UNDEFINED_TABLE,
  '42883': DatabaseErrorCode.UNDEFINED_FUNCTION,
  '53100': DatabaseErrorCode.DISK_FULL,
  '53200': DatabaseErrorCode.OUT_OF_MEMORY,
  '57014': DatabaseErrorCode.QUERY_CANCELED,
  '57P01': DatabaseErrorCode.CONNECTION_CLOSED,
  '57P02': DatabaseErrorCode.CONNECTION_REFUSED,
  '57P03': DatabaseErrorCode.CONNECTION_ERROR
};
