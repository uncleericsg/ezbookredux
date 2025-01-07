# Centralized SEO Implementation Strategy

## Implementation Phases

### Phase 1: Frontend Development (Current)
- Complete page structures
- Finalize component hierarchy
- Establish routing system
- Define content areas
- Set up data flow patterns

### Phase 2: Backend SEO Management (Future)

#### Database Structure
```sql
-- SEO Metadata
CREATE TABLE seo_metadata (
  page_id VARCHAR PRIMARY KEY,
  path VARCHAR NOT NULL,
  title VARCHAR NOT NULL,
  description TEXT,
  keywords TEXT[],
  canonical_url VARCHAR,
  robots_directives VARCHAR,
  updated_at TIMESTAMP
);

-- Schema Data
CREATE TABLE seo_schemas (
  schema_id VARCHAR PRIMARY KEY,
  page_id VARCHAR REFERENCES seo_metadata(page_id),
  schema_type VARCHAR NOT NULL,
  schema_data JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  version INTEGER,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Content Management
CREATE TABLE seo_content (
  content_id VARCHAR PRIMARY KEY,
  page_id VARCHAR REFERENCES seo_metadata(page_id),
  section_type VARCHAR NOT NULL,
  content JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### API Structure
```typescript
// API Routes
/api/seo
├── /metadata
│   ├── GET /:pageId    // Get page metadata
│   ├── PUT /:pageId    // Update metadata
│   └── PATCH /:pageId  // Partial update
├── /schemas
│   ├── GET /:pageId    // Get page schemas
│   ├── POST /create    // Create new schema
│   └── PUT /:schemaId  // Update schema
└── /content
    ├── GET /:pageId    // Get page content
    ├── PUT /:contentId // Update content
    └── POST /bulk      // Bulk updates
```

## Core Structure (Current)

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

## Base Schema Implementation (Current)

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

## Future Integration Points

1. Frontend Components:
```typescript
// pages/[...slug].tsx
export const getServerSideProps = async ({ params }) => {
  const seoData = await fetchSEOData(params.slug);
  return {
    props: {
      seoData,
      // other props
    }
  };
};

// components/SEO.tsx
const SEO: React.FC<{ pageId: string }> = ({ pageId }) => {
  const { data: seoData } = useSEOData(pageId);
  
  return (
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoData.schema) }}
      />
    </Head>
  );
};
```

2. Admin Interface (Future):
```typescript
// Admin routes for SEO management
/admin/seo
├── /pages          // Page metadata management
├── /schemas        // Schema management
├── /content        // Content management
└── /analytics      // SEO performance tracking
```

## Benefits of Phased Approach

1. Frontend First:
- Clear page structure
- Defined content areas
- Established routing
- Stable component hierarchy

2. Backend Integration:
- Dynamic content management
- Centralized control
- Easy updates
- Version control
- A/B testing capability

## Best Practices

1. Development Phase:
- Document SEO requirements
- Plan for future integration
- Keep schemas organized
- Maintain type safety

2. Backend Phase:
- Implement versioning
- Add validation
- Set up monitoring
- Enable analytics

3. Maintenance:
- Regular content updates
- Performance monitoring
- Schema validation
- Analytics tracking

## Implementation Timeline

1. Current Phase:
- Complete frontend development
- Document SEO requirements
- Prepare schema structures

2. Future Phase:
- Set up database
- Create API endpoints
- Build admin interface
- Implement monitoring

This phased approach ensures proper foundation through frontend development before implementing the dynamic SEO management system.