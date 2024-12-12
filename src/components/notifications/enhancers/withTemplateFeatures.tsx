import React from 'react';
import { TemplateAdapter } from '../adapters/templateAdapter';
import type { Template } from '../types/templateTypes';
import type { EnhancedTemplate } from '../adapters/types';

export interface WithTemplateFeaturesProps {
  template: Template | EnhancedTemplate;
}

/**
 * HOC that enhances a template component with additional features
 * Uses the adapter pattern to maintain backward compatibility
 */
export function withTemplateFeatures<P extends WithTemplateFeaturesProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithFeatures(props: P) {
    const { template, ...rest } = props;
    
    // Enhance template using adapter
    const enhancedTemplate = React.useMemo(() => {
      return TemplateAdapter.enhance(template);
    }, [template]);

    // Pass enhanced template to wrapped component
    const enhancedProps = {
      ...rest,
      template: enhancedTemplate
    } as P;

    return <WrappedComponent {...enhancedProps} />;
  };
}
