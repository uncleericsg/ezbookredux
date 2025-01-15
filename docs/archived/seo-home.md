# iAircon Homepage SEO Strategy Documentation

## Overview
This document outlines the comprehensive SEO strategy for iAircon EasyBooking homepage, specifically designed to boost rankings for aircon servicing keywords in the Singapore market.

## Core Schema Implementation

### 1. Business Identity Schema
```typescript
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "iAircon Singapore Aircon Services",
  "description": "Singapore's leading aircon servicing platform offering chemical wash, maintenance, and repair services",
  "url": "https://iaircon.app",
  "logo": "https://iaircon.app/logo.png",
  "image": [
    "https://iaircon.app/images/chemical-wash.jpg",
    "https://iaircon.app/images/maintenance.jpg"
  ],
  "priceRange": "$$",
  "@id": "https://iaircon.app/#organization"
}
```

### 2. Location & Service Area
```typescript
{
  "@type": "LocalBusiness",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "1.3521",
    "longitude": "103.8198"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Singapore",
      "sameAs": "https://www.wikidata.org/wiki/Q334"
    }
  ],
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": "1.3521",
      "longitude": "103.8198"
    },
    "geoRadius": "50km"
  }
}
```

### 3. Service Offerings
```typescript
{
  "@type": "Service",
  "serviceType": "Aircon Servicing",
  "category": "Home Services",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Aircon Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "PowerJet Chemical Wash",
          "description": "Deep cleaning using PowerJet technology",
          "price": "120.00",
          "priceCurrency": "SGD"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Annual Maintenance Contract",
          "description": "Yearly maintenance package with priority support",
          "price": "240.00",
          "priceCurrency": "SGD"
        }
      }
    ]
  }
}
```

### 4. E-A-T Signals
```typescript
{
  "@type": "Organization",
  "knowsAbout": [
    "Air Conditioning Maintenance",
    "Chemical Washing",
    "Aircon Repair",
    "Gas Top-up"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": "Professional Certification",
      "name": "BCA-Certified Technicians"
    }
  ],
  "memberOf": [
    {
      "@type": "Organization",
      "name": "Singapore Renovation Contractors and Material Suppliers Association"
    }
  ]
}
```

### 5. Customer Reviews & Social Proof
```typescript
{
  "@type": "LocalBusiness",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250",
    "bestRating": "5"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "John Tan"
      },
      "reviewBody": "Best chemical wash service in Singapore"
    }
  ]
}
```

### 6. FAQ Implementation
```typescript
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How often should I service my aircon in Singapore?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "In Singapore's tropical climate, we recommend servicing your aircon every 3 months to maintain optimal performance and prevent mold growth."
      }
    },
    {
      "@type": "Question",
      "name": "What is included in PowerJet Chemical Wash?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our PowerJet Chemical Wash includes deep cleaning of all components, antibacterial treatment, and thorough testing."
      }
    }
  ]
}
```

## Technical SEO Implementation

### 1. Core Web Vitals Optimization
- Implement lazy loading for images
- Optimize CSS delivery
- Minimize render-blocking resources
- Monitor Web Vitals metrics

### 2. Mobile Optimization
```typescript
{
  "@type": "WebPage",
  "mainContentOfPage": {
    "@type": "WebPageElement",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".hero-section", "h1", ".service-cards"]
    }
  }
}
```

### 3. Local SEO Enhancement
- Implement proper hreflang tags
- Create local business citations
- Optimize for Singapore-specific keywords
- Add neighborhood targeting

## Content Strategy

### 1. Keyword Optimization
Primary Keywords:
- aircon servicing singapore
- aircon chemical wash
- aircon maintenance
- aircon repair singapore

Long-tail Keywords:
- best aircon chemical wash singapore
- affordable aircon servicing near me
- emergency aircon repair singapore

### 2. Content Structure
- Implement proper H1-H6 hierarchy
- Create content clusters around services
- Optimize meta descriptions
- Implement breadcrumb navigation

## Monitoring & Updates

### 1. Automated Schema Updates
```typescript
// scripts/schema-updater.ts
const checkSchemaUpdates = async () => {
  const response = await fetch('https://schema.org/version/latest');
  const data = await response.json();
  // Compare versions and trigger updates
};
```

### 2. Performance Monitoring
- Track Core Web Vitals
- Monitor search rankings
- Track user engagement metrics
- Monitor conversion rates

### 3. Regular Reviews
- Weekly performance checks
- Monthly ranking analysis
- Quarterly content updates
- Annual strategy review

## Implementation Plan

1. Technical Setup (Week 1)
- Set up schema structure
- Implement Core Web Vitals monitoring
- Configure mobile optimization

2. Content Implementation (Week 2)
- Create optimized content
- Implement FAQ structure
- Set up review system

3. Local SEO (Week 3)
- Implement local business schema
- Create local citations
- Set up Google Business Profile

4. Monitoring Setup (Week 4)
- Configure tracking tools
- Set up automated updates
- Implement reporting system

## Success Metrics
- Improved rankings for target keywords
- Increased organic traffic
- Better click-through rates
- Enhanced conversion rates
- Improved Core Web Vitals scores

This strategy is specifically tailored for iAircon's homepage and Singapore market, focusing on local SEO and aircon service-specific optimizations to maximize search visibility and rankings.