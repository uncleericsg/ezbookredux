# Notification Template System

This document provides an overview of the notification template system, including its components, adapters, and usage guidelines.

## Overview

The notification template system provides a robust way to create, validate, and preview notification templates. It supports multiple message types (email, SMS) and includes features like variable substitution, validation, and analytics tracking.

## Components

### NotificationTemplatePreview

A React component that provides a preview of notification templates with the following features:
- Mobile and desktop preview modes
- Real-time character counting
- Copy to clipboard functionality
- Error and warning display
- Variable substitution preview

```tsx
import { NotificationTemplatePreview } from './NotificationTemplatePreview';

<NotificationTemplatePreview
  template={template}
  sampleData={{ name: 'John' }}
  previewMode="desktop"
  onCopy={(message) => console.log('Copied:', message)}
/>
```

### PreviewModes

A toggle component for switching between mobile and desktop preview modes:

```tsx
import { PreviewModes } from './components/PreviewModes';

<PreviewModes
  mode="desktop"
  onModeChange={(mode) => console.log('New mode:', mode)}
/>
```

## Adapters

### TemplateAdapter

Handles conversion between legacy and enhanced templates:

```typescript
import { TemplateAdapter } from './adapters/templateAdapter';

// Convert legacy template to enhanced template
const enhanced = TemplateAdapter.enhance(template);

// Convert back to legacy template
const legacy = TemplateAdapter.toLegacy(enhanced);

// Update validation
const validated = TemplateAdapter.updateValidation(enhanced, {
  isValid: true,
  errors: []
});
```

### ValidationAdapter

Provides template validation functionality:

```typescript
import { ValidationAdapter } from './adapters/validationAdapter';

const validation = ValidationAdapter.validate(template);
console.log('Is valid:', validation.isValid);
console.log('Errors:', validation.errors);
console.log('Warnings:', validation.warnings);
```

### PreviewAdapter

Handles template preview processing:

```typescript
import { PreviewAdapter } from './adapters/previewAdapter';

// Process message with variables
const processed = PreviewAdapter.processMessage(template, {
  name: 'John'
});

// Create preview configuration
const config = PreviewAdapter.createPreviewConfig(
  template,
  'mobile',
  sampleData,
  utmParams
);

// Get character count
const count = PreviewAdapter.getCharacterCount(message, limit);
```

## Types

### Template Types

```typescript
interface Template {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms';
}

interface EnhancedTemplate extends Template {
  _enhanced: true;
  validation: ValidationResult;
  analytics: AnalyticsData;
  preview: PreviewConfig;
}
```

### Validation Types

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  code: string;
  message: string;
  field?: string;
}
```

### Preview Types

```typescript
interface PreviewConfig {
  mode: 'mobile' | 'desktop';
  sampleData: PreviewData;
  characterLimit: number;
  utmParams?: UtmParams;
}
```

## Best Practices

1. **Template Creation**:
   - Always provide meaningful template titles
   - Use descriptive variable names (e.g., `{firstName}` instead of `{var1}`)
   - Keep messages within character limits

2. **Variable Usage**:
   - Use camelCase for variable names
   - Avoid duplicate variables
   - Document expected variable types

3. **Preview Testing**:
   - Test templates in both mobile and desktop modes
   - Verify variable substitution with sample data
   - Check message length in both modes

4. **Error Handling**:
   - Always validate templates before saving
   - Display validation errors clearly to users
   - Handle missing variables gracefully

## Contributing

When contributing to the notification system:

1. Add tests for new features
2. Update documentation for API changes
3. Follow the existing code style
4. Ensure backward compatibility
5. Run the test suite before submitting changes

## Testing

Run the test suite:

```bash
npm test
```

Or run specific tests:

```bash
npm test -- --grep "TemplateAdapter"
```
