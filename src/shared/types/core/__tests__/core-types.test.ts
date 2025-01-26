import { describe, it, expect } from 'vitest';

import {
  isBaseEntity,
  isAuditableEntity,
  isError,
  isValidationError,
  isAuthenticationError,
  isBusinessError,
  isSystemError,
  createTypeGuard,
  createValidationRule
} from '../guards';

import type {
  BaseEntity,
  AuditableEntity,
  BaseError,
  ValidationError,
  AuthenticationError,
  BusinessError,
  SystemError
} from '../types';

describe('Core Type Guards', () => {
  describe('isBaseEntity', () => {
    it('should return true for valid BaseEntity', () => {
      const entity: BaseEntity = {
        id: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      expect(isBaseEntity(entity)).toBe(true);
    });

    it('should return false for invalid BaseEntity', () => {
      expect(isBaseEntity(null)).toBe(false);
      expect(isBaseEntity({})).toBe(false);
      expect(isBaseEntity({ id: '1' })).toBe(false);
    });
  });

  describe('isAuditableEntity', () => {
    it('should return true for valid AuditableEntity', () => {
      const entity: AuditableEntity = {
        id: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'user1',
        updatedBy: 'user2',
        version: 1
      };
      expect(isAuditableEntity(entity)).toBe(true);
    });

    it('should return false for invalid AuditableEntity', () => {
      expect(isAuditableEntity(null)).toBe(false);
      expect(isAuditableEntity({})).toBe(false);
      expect(isAuditableEntity({ id: '1' })).toBe(false);
    });
  });

  describe('isError', () => {
    it('should return true for valid BaseError', () => {
      const error: BaseError = {
        type: 'VALIDATION_ERROR',
        code: 'VALIDATION_ERROR_123',
        message: 'Invalid input'
      };
      expect(isError(error)).toBe(true);
    });

    it('should return false for invalid BaseError', () => {
      expect(isError(null)).toBe(false);
      expect(isError({})).toBe(false);
      expect(isError({ type: 'ERROR' })).toBe(false);
    });
  });

  describe('Specific Error Guards', () => {
    const baseError: BaseError = {
      type: 'VALIDATION_ERROR',
      code: 'ERROR_123',
      message: 'Test error'
    };

    it('should validate ValidationError', () => {
      const error: ValidationError = {
        ...baseError,
        type: 'VALIDATION_ERROR',
        fields: [{ field: 'name', message: 'Required' }]
      };
      expect(isValidationError(error)).toBe(true);
      expect(isValidationError(baseError)).toBe(false);
    });

    it('should validate AuthenticationError', () => {
      const error: AuthenticationError = {
        ...baseError,
        type: 'AUTHENTICATION_ERROR',
        provider: 'local'
      };
      expect(isAuthenticationError(error)).toBe(true);
      expect(isAuthenticationError(baseError)).toBe(false);
    });

    it('should validate BusinessError', () => {
      const error: BusinessError = {
        ...baseError,
        type: 'BUSINESS_ERROR',
        ruleCode: 'RULE_001'
      };
      expect(isBusinessError(error)).toBe(true);
      expect(isBusinessError(baseError)).toBe(false);
    });

    it('should validate SystemError', () => {
      const error: SystemError = {
        ...baseError,
        type: 'SYSTEM_ERROR',
        stack: 'Error stack'
      };
      expect(isSystemError(error)).toBe(true);
      expect(isSystemError(baseError)).toBe(false);
    });
  });

  describe('Guard Utilities', () => {
    it('should create custom type guards', () => {
      const isStringArray = createTypeGuard<string[]>(
        (value): value is string[] => Array.isArray(value) && value.every(item => typeof item === 'string')
      );

      expect(isStringArray(['a', 'b'])).toBe(true);
      expect(isStringArray([1, 2])).toBe(false);
      expect(isStringArray('not an array')).toBe(false);
    });

    it('should create validation rules', () => {
      const rule = createValidationRule<string>(
        (value): value is string => typeof value === 'string',
        'Must be a string'
      );

      expect(rule.validate('test')).toBe(true);
      expect(rule.validate(123)).toBe(false);
      expect(rule.message).toBe('Must be a string');
    });
  });
});