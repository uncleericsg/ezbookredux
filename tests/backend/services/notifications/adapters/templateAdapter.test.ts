import { describe, it, expect } from 'vitest'

import { TemplateAdapter } from '../../../../../src/components/notifications/adapters/templateAdapter'
import { MESSAGE_LIMITS } from '../../../../../src/components/notifications/constants/templateConstants'

import type { EnhancedTemplate, AnalyticsData } from '../../../../../src/components/notifications/adapters/types'
import type { Template } from '../../../../../src/components/notifications/types/templateTypes'

describe('TemplateAdapter', () => {
  const mockTemplate: Template = {
    id: '1',
    name: 'Test Template',
    content: 'Hello {name}!',
    userType: 'all',
    variables: ['name'],
    version: '1.0.0',
    lastModified: new Date().toISOString(),
    createdBy: 'test-user',
    isActive: true
  }

  describe('enhance', () => {
    it('should convert a legacy template to an enhanced template', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate)

      expect(enhanced._enhanced).toBe(true)
      expect(enhanced.validation).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      })
      expect(enhanced.analytics).toEqual({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        performance: {
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0
        }
      })
      expect(enhanced.preview).toEqual({
        mode: 'desktop',
        sampleData: {},
        characterLimit: MESSAGE_LIMITS.email || 1000,
        utmParams: {
          utmSource: '',
          utmMedium: '',
          utmCampaign: ''
        }
      })
    })

    it('should preserve all original template properties', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate)
      
      expect(enhanced.id).toBe(mockTemplate.id)
      expect(enhanced.name).toBe(mockTemplate.name)
      expect(enhanced.content).toBe(mockTemplate.content)
      expect(enhanced.userType).toBe(mockTemplate.userType)
      expect(enhanced.variables).toEqual(mockTemplate.variables)
    })
  })

  describe('toLegacy', () => {
    it('should convert an enhanced template back to a legacy template', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate)
      const legacy = TemplateAdapter.toLegacy(enhanced)

      expect(legacy._enhanced).toBeUndefined()
      expect(legacy.validation).toBeUndefined()
      expect(legacy.analytics).toBeUndefined()
      expect(legacy.preview).toBeUndefined()
      expect(legacy).toEqual(mockTemplate)
    })
  })

  describe('updateValidation', () => {
    it('should update template validation', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate)
      const newValidation = {
        isValid: false,
        errors: [{ code: 'TEST', message: 'Test error', field: 'test' }]
      }

      const updated = TemplateAdapter.updateValidation(enhanced, newValidation)

      expect(updated.validation.isValid).toBe(false)
      expect(updated.validation.errors).toEqual(newValidation.errors)
      expect(updated.validation.warnings).toEqual([])
    })
  })

  describe('updateAnalytics', () => {
    it('should update template analytics', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate)
      const newAnalytics: Partial<AnalyticsData> = {
        impressions: 100,
        clicks: 50,
        performance: {
          deliveryRate: 0.95,
          openRate: 0.75,
          clickRate: 0.5
        }
      }

      const updated = TemplateAdapter.updateAnalytics(enhanced, newAnalytics)

      expect(updated.analytics.impressions).toBe(100)
      expect(updated.analytics.clicks).toBe(50)
      expect(updated.analytics.performance.deliveryRate).toBe(0.95)
      expect(updated.analytics.performance.openRate).toBe(0.75)
      expect(updated.analytics.performance.clickRate).toBe(0.5)
    })
  })
})