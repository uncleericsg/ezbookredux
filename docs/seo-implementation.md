# Centralized SEO Implementation Strategy

## Core Structure

```typescript
src/
  components/
    seo/
      base/
        businessSchema.ts      // Core business information
        locationSchema.ts      // Service area & location
        contactSchema.ts       // Contact information
        servicesSchema.ts      // Service offerings
        reviewSchema.ts        // Reviews & ratings
      templates/
        servicePage.ts        // Template for service pages
        bookingPage.ts        // Template for booking pages
        contactPage.ts        // Template for contact pages
      utils/
        schemaGenerator.ts    // Schema generation utilities
        validator.ts          // Schema validation
      pages/
        home.ts              // Homepage specific schema
        chemical-wash.ts     // Chemical wash page schema
        booking.ts           // Booking page schema
```

## Base Schema Implementation

```typescript
// src/components/seo/base/businessSchema.ts
export const getBaseBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "iAircon Singapore Aircon Services",
  "url": "https://iaircon.app",
  // ... other common business details
});

// src/components/seo/utils/schemaGenerator.ts
import { getBaseBusinessSchema } from '../base/businessSchema';

export const generatePageSchema = (pageType: string, pageData: any) => {
  const baseSchema = getBaseBusinessSchema();
  
  switch(pageType) {
    case 'service':
      return {
        ...baseSchema,
        "@type": "Service",
        // ... service-specific schema
      };
    case 'booking':
      return {
        ...baseSchema,
        "@type": "BookingService",
        // ... booking-specific schema
      };
    // ... other page types
  }
};
```

## Usage Example

```typescript
// src/components/home/seo/index.ts
import { generatePageSchema } from '../../seo/utils/schemaGenerator';

export const homePageSchema = generatePageSchema('home', {
  title: 'Singapore Aircon Services',
  description: 'Professional aircon servicing...',
  // ... other home-specific data
});

// src/components/chemical-wash/seo/index.ts
export const chemicalWashSchema = generatePageSchema('service', {
  serviceType: 'Chemical Wash',
  price: '120.00',
  // ... service-specific data
});
```

## Benefits of Centralized Approach

1. Consistency
- Unified business information
- Standardized schema structure
- Consistent SEO signals

2. Maintainability
- Single source of truth
- Easy updates to shared data
- Centralized validation

3. Efficiency
- Reusable components
- Automated schema generation
- Reduced duplication

4. Flexibility
- Easy to extend for new pages
- Simple to customize
- Page-specific optimizations

## Implementation Steps

1. Setup Base Structure
```bash
mkdir -p src/components/seo/{base,templates,utils,pages}
```

2. Create Base Schemas
```typescript
// Core business information
// Location data
// Contact details
// Service offerings
```

3. Implement Templates
```typescript
// Page type templates
// Schema generators
// Validation utilities
```

4. Apply to Pages
```typescript
// Import and use in components
// Add page-specific data
// Validate implementation
```

## Maintenance

1. Regular Updates
- Weekly schema validation
- Monthly content updates
- Quarterly strategy review

2. Monitoring
- Track schema effectiveness
- Monitor search rankings
- Analyze user engagement

3. Optimization
- Update based on analytics
- Enhance based on search trends
- Improve based on user behavior

## Best Practices

1. Schema Organization
- Keep base schemas separate
- Use clear naming conventions
- Maintain type safety

2. Implementation
- Validate all schemas
- Test rich results
- Monitor performance

3. Updates
- Document all changes
- Version control schemas
- Track effectiveness

This centralized approach ensures:
- Consistent SEO implementation
- Efficient development
- Easy maintenance
- Flexible customization
- Scalable structure

The system can be easily extended for new pages while maintaining SEO best practices and optimization for each specific page type.