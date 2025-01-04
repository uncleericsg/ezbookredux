# PowerJetChemWash Code Splitting Plan

## Updated File Structure
```
src/components/booking/
├── PowerJetChemWashHome.tsx         # Main container
├── components/
│   ├── HeroSection.tsx              # Hero section
│   ├── PowerJetServiceCard.tsx      # PowerJet-specific service card
│   ├── ServicesGrid.tsx             # Services grid container
│   ├── KeyFeatures.tsx              # Key features section
│   ├── Testimonials.tsx             # Testimonials section
│   └── index.ts                     # Barrel file for exports
└── types/
    └── serviceTypes.ts              # Shared types
```

## Implementation Strategy
1. Create new PowerJetServiceCard.tsx instead of modifying existing ServiceCard.tsx
2. Keep existing ServiceCard.tsx for its current use cases
3. Consider creating a base ServiceCard component in future if significant overlap
4. Update imports and exports accordingly

## Benefits
- Maintains separation of concerns
- Prevents file bloat
- Preserves existing functionality
- Allows for future refactoring if needed

## Updated Tracking
- [ ] Create type definitions
- [ ] Implement PowerJetServiceCard component
- [ ] Implement ServicesGrid component
- [ ] Implement HeroSection component
- [ ] Implement KeyFeatures component
- [ ] Implement Testimonials component
- [ ] Refactor main component
- [ ] Test all components
- [ ] Verify lazy loading