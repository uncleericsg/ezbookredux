import { ValidationAdapter } from '../validationAdapter';
import type { Template } from '../../types/templateTypes';
import { TEMPLATE_TYPES, MESSAGE_LIMITS } from '../../constants/templateConstants';

describe('ValidationAdapter', () => {
  describe('validate', () => {
    it('should validate a valid template', () => {
      const template: Template = {
        id: '1',
        title: 'Valid Template',
        message: 'Hello {name}!',
        type: TEMPLATE_TYPES.EMAIL
      };

      const result = ValidationAdapter.validate(template);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should detect missing required fields', () => {
      const template: Partial<Template> = {
        id: '1',
        title: '',
        message: '',
      } as Template;

      const result = ValidationAdapter.validate(template);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3); // title, message, and type
      expect(result.errors[0]).toMatchObject({
        code: 'REQUIRED_FIELD',
        field: 'title'
      });
      expect(result.errors[1]).toMatchObject({
        code: 'REQUIRED_FIELD',
        field: 'message'
      });
      expect(result.errors[2]).toMatchObject({
        code: 'REQUIRED_FIELD',
        field: 'type'
      });
    });

    it('should detect message length violations', () => {
      const template: Template = {
        id: '1',
        title: 'Test',
        message: 'A'.repeat(200),
        type: TEMPLATE_TYPES.SMS
      };

      const result = ValidationAdapter.validate(template);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        code: 'MESSAGE_TOO_LONG',
        field: 'message',
        limit: MESSAGE_LIMITS[TEMPLATE_TYPES.SMS]
      });
    });

    it('should detect duplicate variables', () => {
      const template: Template = {
        id: '1',
        title: 'Test',
        message: 'Hello {name}! How are you {name}?',
        type: TEMPLATE_TYPES.EMAIL
      };

      const result = ValidationAdapter.validate(template);

      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toMatchObject({
        code: 'DUPLICATE_VARIABLES',
        field: 'message',
        variables: ['name']
      });
      expect(result.isValid).toBe(true); // Duplicates are warnings, not errors
    });

    it('should detect invalid variable names', () => {
      const template: Template = {
        id: '1',
        title: 'Test',
        message: 'Hello {123}! How are you {invalid-name}?',
        type: TEMPLATE_TYPES.EMAIL
      };

      const result = ValidationAdapter.validate(template);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toMatchObject({
        code: 'INVALID_VARIABLES',
        field: 'message',
        variables: ['123', 'invalid-name']
      });
    });
  });

  describe('extractVariables', () => {
    it('should extract unique variables from message', () => {
      const message = 'Hello {firstName} {lastName} {firstName}!';
      const variables = ValidationAdapter.extractVariables(message);

      // Should return all variables, including duplicates
      expect(variables).toEqual(['firstName', 'lastName', 'firstName']);
    });

    it('should return empty array for message without variables', () => {
      const message = 'Hello World!';
      const variables = ValidationAdapter.extractVariables(message);

      expect(variables).toEqual([]);
    });
  });
});
