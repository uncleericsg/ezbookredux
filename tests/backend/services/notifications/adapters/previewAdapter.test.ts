import { describe, it, expect, beforeEach } from 'vitest'

import { PreviewAdapter } from '../../../../../src/components/notifications/adapters/previewAdapter'

import type {
  PreviewConfig,
  UtmParams
} from '../../../../../src/components/notifications/types/messageTypes'
import type { Template } from '../../../../../src/components/notifications/types/templateTypes'

describe('PreviewAdapter', () => {
  let adapter: PreviewAdapter

  const mockTemplate: Template = {
    id: '1',
    name: 'Test Template',
    content: 'Hello {firstName} {lastName}!',
    userType: 'all',
    variables: ['firstName', 'lastName'],
    version: '1.0.0',
    lastModified: new Date().toISOString(),
    createdBy: 'test-user',
    isActive: true
  }

  beforeEach(() => {
    adapter = new PreviewAdapter()
  })

  describe('processMessage', () => {
    it('should process message with preview data', () => {
      const config: PreviewConfig = {
        mode: 'desktop',
        sampleData: {
          firstName: 'John',
          lastName: 'Doe'
        },
        characterLimit: 1000,
        utmParams: {
          utmSource: 'test',
          utmMedium: 'email',
          utmCampaign: 'test'
        }
      }

      const processed = adapter.processMessage(mockTemplate.content, config)
      expect(processed).toBe('Hello John Doe!')
    })

    it('should keep variables when no preview data provided', () => {
      const config: PreviewConfig = {
        mode: 'desktop',
        sampleData: {},
        characterLimit: 1000,
        utmParams: {
          utmSource: 'test',
          utmMedium: 'email',
          utmCampaign: 'test'
        }
      }

      const processed = adapter.processMessage(mockTemplate.content, config)
      expect(processed).toBe('Hello {firstName} {lastName}!')
    })

    it('should sanitize HTML content', () => {
      const config: PreviewConfig = {
        mode: 'desktop',
        sampleData: { name: 'John' },
        characterLimit: 1000,
        utmParams: {
          utmSource: 'test',
          utmMedium: 'email',
          utmCampaign: 'test'
        }
      }

      const message = 'Hello <script>alert("xss")</script>{name}!'
      const processed = adapter.processMessage(message, config)
      expect(processed).not.toContain('<script>')
      expect(processed).toContain('Hello')
      expect(processed).toContain('John')
    })
  })

  describe('createPreviewConfig', () => {
    it('should create default preview configuration', () => {
      const config = adapter.createPreviewConfig(mockTemplate)

      expect(config.mode).toBe('desktop')
      expect(config.sampleData).toEqual({})
      expect(config.characterLimit).toBeDefined()
      expect(config.utmParams).toBeDefined()
      expect(config.utmParams.utmSource).toBe('preview')
      expect(config.utmParams.utmMedium).toBe('email')
      expect(config.utmParams.utmCampaign).toBe(mockTemplate.name)
    })

    it('should respect provided mode and sample data', () => {
      const sampleData = { firstName: 'John' }
      const config = adapter.createPreviewConfig(mockTemplate, 'mobile', sampleData)

      expect(config.mode).toBe('mobile')
      expect(config.sampleData).toEqual(sampleData)
    })

    it('should use custom UTM parameters when provided', () => {
      const utmParams: UtmParams = {
        utmSource: 'custom',
        utmMedium: 'test',
        utmCampaign: 'campaign'
      }

      const config = adapter.createPreviewConfig(mockTemplate, 'desktop', {}, utmParams)
      expect(config.utmParams).toEqual(utmParams)
    })
  })

  describe('getCharacterCount', () => {
    it('should return correct character count info when under limit', () => {
      const message = 'Hello World'
      const limit = 20
      const count = adapter.getCharacterCount(message, limit)

      expect(count.current).toBe(11)
      expect(count.limit).toBe(limit)
      expect(count.remaining).toBe(9)
      expect(count.isOverLimit).toBe(false)
    })

    it('should return correct character count info when over limit', () => {
      const message = 'This is a very long message'
      const limit = 10
      const count = adapter.getCharacterCount(message, limit)

      expect(count.current).toBe(27)
      expect(count.limit).toBe(limit)
      expect(count.remaining).toBe(-17)
      expect(count.isOverLimit).toBe(true)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit phone numbers', () => {
      const phone = '1234567890'
      expect(adapter.formatPhoneNumber(phone)).toBe('(123) 456-7890')
    })

    it('should format 11-digit phone numbers', () => {
      const phone = '11234567890'
      expect(adapter.formatPhoneNumber(phone)).toBe('+1 (123) 456-7890')
    })

    it('should return original string for other formats', () => {
      const phone = '123456'
      expect(adapter.formatPhoneNumber(phone)).toBe('123456')
    })
  })

  describe('generateUrl', () => {
    it('should generate URL with UTM parameters', () => {
      const baseUrl = 'https://example.com'
      const utmParams: UtmParams = {
        utmSource: 'test',
        utmMedium: 'email',
        utmCampaign: 'campaign'
      }

      const url = adapter.generateUrl(baseUrl, utmParams)
      expect(url).toContain('utm_source=test')
      expect(url).toContain('utm_medium=email')
      expect(url).toContain('utm_campaign=campaign')
    })

    it('should handle URLs with existing query parameters', () => {
      const baseUrl = 'https://example.com?param=value'
      const utmParams: UtmParams = {
        utmSource: 'test',
        utmMedium: 'email',
        utmCampaign: 'campaign'
      }

      const url = adapter.generateUrl(baseUrl, utmParams)
      expect(url).toContain('param=value')
      expect(url).toContain('utm_source=test')
    })
  })
})