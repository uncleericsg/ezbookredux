import React from 'react'
import { describe, it, expect } from 'vitest'

import { withTemplateFeatures } from '../../../../src/components/notifications/enhancers/withTemplateFeatures'
import { renderWithProviders } from '../../../setup/test-utils'

import type { EnhancedTemplate } from '../../../../src/components/notifications/adapters/types'
import type { Template, TemplateFeatures } from '../../../../src/components/notifications/types/templateTypes'

describe('withTemplateFeatures HOC', () => {
  // Mock component
  const MockComponent: React.FC<{ template: Template | EnhancedTemplate }> = ({ template }) => (
    <div data-testid="mock-component">
      {(template as EnhancedTemplate)._enhanced ? 'Enhanced' : 'Not Enhanced'}
    </div>
  )

  // Create wrapped component
  const WrappedComponent = withTemplateFeatures(MockComponent)

  // Mock template
  const mockTemplate: Template = {
    id: '1',
    name: 'Test Template',
    content: 'Hello {name}!',
    userType: 'all',
    variables: ['name'],
    version: '1.0.0',
    lastModified: new Date().toISOString(),
    createdBy: 'test-user',
    isActive: true,
    category: 'test',
    tags: ['test'],
    permissions: ['read', 'write']
  }

  it('should enhance template when not already enhanced', () => {
    const { getByTestId } = renderWithProviders(
      <WrappedComponent template={mockTemplate} />
    )
    
    const element = getByTestId('mock-component')
    expect(element.textContent).toBe('Enhanced')
  })

  it('should not re-enhance already enhanced template', () => {
    const enhancedTemplate: Template & Required<TemplateFeatures> = {
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
        conversions: 0
      },
      preview: {
        mode: 'desktop',
        sampleData: {},
        characterLimit: 1000
      }
    }

    const { getByTestId } = renderWithProviders(
      <WrappedComponent template={enhancedTemplate} />
    )
    
    const element = getByTestId('mock-component')
    expect(element.textContent).toBe('Enhanced')
  })
})