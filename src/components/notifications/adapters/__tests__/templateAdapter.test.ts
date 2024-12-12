import { TemplateAdapter } from '../templateAdapter';
import type { Template } from '../../types/templateTypes';
import type { EnhancedTemplate } from '../types';
import { MESSAGE_LIMITS } from '../../constants/templateConstants';

describe('TemplateAdapter', () => {
  const mockTemplate: Template = {
    id: '1',
    title: 'Test Template',
    message: 'Hello {name}!',
    type: 'email'
  };

  describe('enhance', () => {
    it('should convert a legacy template to an enhanced template', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate);

      expect(enhanced._enhanced).toBe(true);
      expect(enhanced.validation).toEqual({
        isValid: true,
        errors: [],
        warnings: []
      });
      expect(enhanced.analytics).toEqual({
        impressions: 0,
        clicks: 0,
        conversions: 0,
        performance: {
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0
        }
      });
      expect(enhanced.preview).toEqual({
        mode: 'desktop',
        sampleData: {},
        characterLimit: MESSAGE_LIMITS[mockTemplate.type] || 1000,
        utmParams: {
          utmSource: '',
          utmMedium: '',
          utmCampaign: ''
        }
      });
    });

    it('should preserve all original template properties', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate);
      
      expect(enhanced.id).toBe(mockTemplate.id);
      expect(enhanced.title).toBe(mockTemplate.title);
      expect(enhanced.message).toBe(mockTemplate.message);
      expect(enhanced.type).toBe(mockTemplate.type);
    });
  });

  describe('toLegacy', () => {
    it('should convert an enhanced template back to a legacy template', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate);
      const legacy = TemplateAdapter.toLegacy(enhanced);

      expect(legacy._enhanced).toBeUndefined();
      expect(legacy.validation).toBeUndefined();
      expect(legacy.analytics).toBeUndefined();
      expect(legacy.preview).toBeUndefined();
      expect(legacy).toEqual(mockTemplate);
    });
  });

  describe('updateValidation', () => {
    it('should update template validation', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate);
      const newValidation = {
        isValid: false,
        errors: [{ code: 'TEST', message: 'Test error', field: 'test' }]
      };

      const updated = TemplateAdapter.updateValidation(enhanced, newValidation);

      expect(updated.validation.isValid).toBe(false);
      expect(updated.validation.errors).toEqual(newValidation.errors);
      expect(updated.validation.warnings).toEqual([]);
    });
  });

  describe('updateAnalytics', () => {
    it('should update template analytics', () => {
      const enhanced = TemplateAdapter.enhance(mockTemplate);
      const newAnalytics = {
        impressions: 100,
        clicks: 50,
        performance: {
          deliveryRate: 0.95,
          clickRate: 0.5
        }
      };

      const updated = TemplateAdapter.updateAnalytics(enhanced, newAnalytics);

      expect(updated.analytics.impressions).toBe(100);
      expect(updated.analytics.clicks).toBe(50);
      expect(updated.analytics.performance.deliveryRate).toBe(0.95);
      expect(updated.analytics.performance.clickRate).toBe(0.5);
      expect(updated.analytics.performance.openRate).toBe(0);
    });
  });
});
