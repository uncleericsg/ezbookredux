import React from 'react';
import { render } from '@testing-library/react';
import { withTemplateFeatures } from '../enhancers/withTemplateFeatures';
import type { Template } from '../types/templateTypes';
import type { EnhancedTemplate } from '../adapters/types';

describe('withTemplateFeatures HOC', () => {
  // Mock component
  const MockComponent: React.FC<{ template: Template | EnhancedTemplate }> = ({ template }) => (
    <div data-testid="mock-component">
      {(template as EnhancedTemplate)._enhanced ? 'Enhanced' : 'Not Enhanced'}
    </div>
  );

  // Create wrapped component
  const WrappedComponent = withTemplateFeatures(MockComponent);

  // Mock template
  const mockTemplate: Template = {
    id: '1',
    title: 'Test Template',
    message: 'Hello {name}!',
    type: 'email'
  };

  it('should enhance template when not already enhanced', () => {
    const { getByTestId } = render(
      <WrappedComponent template={mockTemplate} />
    );
    
    const element = getByTestId('mock-component');
    expect(element.textContent).toBe('Enhanced');
  });

  it('should not re-enhance already enhanced template', () => {
    const enhancedTemplate: EnhancedTemplate = {
      ...mockTemplate,
      _enhanced: true,
      validation: {
        isValid: true,
        errors: [],
        warnings: []
      },
      analytics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        performance: {
          deliveryRate: 0,
          openRate: 0,
          clickRate: 0
        }
      },
      preview: {
        mode: 'desktop',
        sampleData: {},
        characterLimit: 1000,
        utmParams: {
          utmSource: '',
          utmMedium: '',
          utmCampaign: ''
        }
      }
    };

    const { getByTestId } = render(
      <WrappedComponent template={enhancedTemplate} />
    );
    
    const element = getByTestId('mock-component');
    expect(element.textContent).toBe('Enhanced');
  });
});
