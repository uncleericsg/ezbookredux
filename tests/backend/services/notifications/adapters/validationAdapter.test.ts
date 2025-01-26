import { describe, it, expect } from 'vitest'

import { ValidationAdapter } from '../../../../../src/components/notifications/adapters/validationAdapter'
import { TEMPLATE_TYPES, MESSAGE_LIMITS } from '../../../../../src/components/notifications/constants/templateConstants'

import type { Template } from '../../../../../src/components/notifications/types/templateTypes'

describe('ValidationAdapter', () => {
  describe('validate', () => {
    it('should validate a valid template', () => {
      const template: Template = {
        id: '1',
        name: 'Valid Template',
        content: 'Hello {name}!',
        userType: 'all',
        variables: ['name'],
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: 'test-user',
        isActive: true
      }

      const result = ValidationAdapter.validate(template)

      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
      expect(result.warnings).toHaveLength(0)
    })

    it('should detect missing required fields', () => {
      const template: Template = {
        id: '1',
        name: '',
        content: '',
        userType: 'all',
        variables: [],
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: 'test-user',
        isActive: true
      }

      const result = ValidationAdapter.validate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // name and content
      expect(result.errors[0]).toMatchObject({
        code: 'REQUIRED_FIELD',
        field: 'name'
      })
      expect(result.errors[1]).toMatchObject({
        code: 'REQUIRED_FIELD',
        field: 'content'
      })
    })

    it('should detect content length violations', () => {
      const template: Template = {
        id: '1',
        name: 'Test',
        content: 'A'.repeat(5001),
        userType: 'all',
        variables: [],
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: 'test-user',
        isActive: true
      }

      const result = ValidationAdapter.validate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatchObject({
        code: 'CONTENT_TOO_LONG',
        field: 'content',
        limit: 5000
      })
    })

    it('should detect duplicate variables', () => {
      const template: Template = {
        id: '1',
        name: 'Test',
        content: 'Hello {name}! How are you {name}?',
        userType: 'all',
        variables: ['name', 'name'],
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: 'test-user',
        isActive: true
      }

      const result = ValidationAdapter.validate(template)

      expect(result.warnings).toHaveLength(1)
      expect(result.warnings[0]).toMatchObject({
        code: 'DUPLICATE_VARIABLES',
        field: 'variables',
        variables: ['name']
      })
      expect(result.isValid).toBe(true) // Duplicates are warnings, not errors
    })

    it('should detect invalid variable names', () => {
      const template: Template = {
        id: '1',
        name: 'Test',
        content: 'Hello {123}! How are you {invalid-name}?',
        userType: 'all',
        variables: ['123', 'invalid-name'],
        version: '1.0.0',
        lastModified: new Date().toISOString(),
        createdBy: 'test-user',
        isActive: true
      }

      const result = ValidationAdapter.validate(template)

      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatchObject({
        code: 'INVALID_VARIABLES',
        field: 'variables',
        variables: ['123', 'invalid-name']
      })
    })
  })

  describe('extractVariables', () => {
    it('should extract unique variables from content', () => {
      const content = 'Hello {firstName} {lastName} {firstName}!'
      const variables = ValidationAdapter.extractVariables(content)

      // Should return all variables, including duplicates
      expect(variables).toEqual(['firstName', 'lastName', 'firstName'])
    })

    it('should return empty array for content without variables', () => {
      const content = 'Hello World!'
      const variables = ValidationAdapter.extractVariables(content)

      expect(variables).toEqual([])
    })
  })
})