# SEO Testing Tools Guide

## Primary Testing Tools

### 1. Google Rich Results Test
- URL: https://search.google.com/test/rich-results
- Purpose: Test structured data and preview rich results
- Features:
  * Live URL testing
  * Code snippet testing
  * Mobile/desktop preview
  * Detailed error reports
  * Schema validation

### 2. Schema Markup Validator
- URL: https://validator.schema.org/
- Purpose: Validate schema.org markup
- Features:
  * Comprehensive validation
  * Syntax checking
  * Best practices verification
  * Cross-reference checking

### 3. Google Search Console
- URL: https://search.google.com/search-console
- Purpose: Monitor live rich results
- Features:
  * Rich results performance
  * Error monitoring
  * Mobile usability
  * Index coverage

## Testing Process

### 1. Development Testing
```bash
# Step 1: Local Validation
- Use Schema Markup Validator for code
- Test individual schema components
- Verify syntax and structure

# Step 2: Rich Results Test
- Test complete page markup
- Check mobile rendering
- Verify all required properties
```

### 2. Production Testing
```bash
# Step 1: URL Testing
- Test live URLs in Rich Results Test
- Verify all rich snippets
- Check mobile optimization

# Step 2: Monitoring
- Set up Search Console
- Monitor rich results status
- Track performance metrics
```

## Testing Checklist

### Schema Validation
- [ ] All required properties present
- [ ] Syntax is valid
- [ ] No deprecated features
- [ ] Proper nesting structure
- [ ] Correct data types

### Rich Results
- [ ] Logo appears correctly
- [ ] Ratings display properly
- [ ] Prices show correctly
- [ ] FAQ snippets work
- [ ] Service details visible

### Mobile Testing
- [ ] Mobile rendering correct
- [ ] Touch targets adequate
- [ ] Content readable
- [ ] Images optimized
- [ ] Loading speed good

## Common Issues & Solutions

### 1. Missing Required Fields
```typescript
// Wrong
{
  "@type": "Service",
  "name": "Aircon Cleaning"
}

// Correct
{
  "@type": "Service",
  "name": "Aircon Cleaning",
  "provider": {
    "@type": "LocalBusiness",
    "name": "iAircon"
  }
}
```

### 2. Invalid Property Values
```typescript
// Wrong
{
  "price": "expensive"
}

// Correct
{
  "priceRange": "$$",
  "offers": {
    "@type": "Offer",
    "price": "120.00",
    "priceCurrency": "SGD"
  }
}
```

## Testing Schedule

### Daily
- Check Rich Results Test for new pages
- Verify schema validation
- Monitor Search Console

### Weekly
- Full schema validation
- Cross-device testing
- Performance monitoring

### Monthly
- Comprehensive audit
- Update testing documentation
- Review best practices

## Best Practices

1. Regular Testing
- Test after each schema update
- Verify all page types
- Monitor live results

2. Documentation
- Keep testing logs
- Document issues found
- Track solutions implemented

3. Monitoring
- Set up alerts in Search Console
- Track rich results performance
- Monitor mobile usability

4. Updates
- Stay current with schema.org updates
- Follow Google's guidelines
- Update testing procedures

This testing strategy ensures our schema implementation remains effective and up-to-date with current standards.