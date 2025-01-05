# Homepage Code Splitting Strategy

## Overview
This document outlines the strategy for code splitting the homepage (ServiceCategorySelection) component. For detailed implementation analysis, see [homepage-codesplit-analysis.md](./homepage-codesplit-analysis.md).

## Failed Attempts Analysis

### Attempt 1: CSS Module Migration
- Tried to move ServiceCategorySelection.module.css to home/styles/Home.module.css
- Failed because the original styling was actually using direct Tailwind classes, not CSS modules
- Lesson: Should have analyzed the original component's styling approach first

### Attempt 2: Global CSS Classes
- Tried to use service-category-card class from home.css
- Failed because the original component used direct Tailwind utility classes for dynamic styling
- Lesson: The global CSS was only for layout structure, not component-specific styling

### Attempt 3: Background Gradient
- Tried various approaches with bg-gradient-overlay class
- Failed because we didn't maintain the exact order of background layers from the original
- Lesson: CSS layer order matters, especially with backdrop-blur effects

### Attempt 4: Component Structure
- Initially split components without preserving the exact class order
- Failed because Tailwind's order-dependent styles were disrupted
- Lesson: When splitting components, must maintain exact class ordering

### Attempt 5: State Persistence Issue
Sequence of events:
1. Initially cards were visible after removing video background
2. Cards disappeared after page refresh
3. Cards were clickable but not visible
4. Attempted to fix with CSS classes, but issue persisted
5. Root cause: useMemo dependency on Redux state caused empty initial render
- Lesson: Avoid depending on rehydrated state for initial UI rendering

### Key Insight: State Management
The original working version:
1. Defined categories directly in the component, not in useMemo
2. Categories were available immediately on first render
3. AMC category was added conditionally but base categories were always present
4. No dependency on rehydrated state for initial UI
5. Redux state only affected the optional AMC category

### Solution Implementation
1. Remove useMemo for categories
2. Define base categories directly in component
3. Use simple conditional for AMC category
4. Ensure UI is valid even before state rehydration
5. Test component behavior on both:
   - Fresh page load
   - Page refresh
   - Redux state changes

### Root Cause Analysis
Looking at the original working version:
1. It used direct Tailwind classes for dynamic styling (colors, gradients)
2. Background effects were layered in specific order:
   - Base background
   - Gradient overlay
   - Backdrop blur
3. No CSS modules were actually used for the critical styling
4. Global CSS was only for layout structure
5. Component state was properly handled during rehydration

### Key Insights from Working Version
1. State Management:
   - Original version handled both initial and rehydrated states
   - Categories were available immediately, not dependent on async loading
2. Styling Approach:
   - Used inline Tailwind classes for dynamic styles
   - Avoided CSS modules for critical UI elements
   - Maintained specific order of background layers
3. Component Structure:
   - Single responsibility components
   - Clear separation of layout and feature components
   - Proper state propagation through props

### Solution Strategy
1. Preserve exact Tailwind classes from original
2. Maintain layer order in HomePage component
3. Keep dynamic styles inline rather than in CSS
4. Use global CSS only for grid layout
5. Ensure proper state handling during rehydration
6. Test component behavior with both fresh load and refresh

## Strategy

### 1. Directory Structure
```
src/
  components/
    home/
      layout/        # Layout components
      features/      # Feature components
      sections/      # Section components
      hooks/         # Custom hooks
      utils/         # Utility functions
```

### 2. Component Breakdown
1. Layout Components:
```
home/layout/
- HomeLayout.tsx      # Main layout wrapper
- HomeHeader.tsx      # Header section
- HomeContainer.tsx   # Content container
```

2. Feature Components:
```
home/features/
- CategoryCard.tsx    # Service category card
- TestimonialCard.tsx # Testimonial display
- RatingModal.tsx     # Rating interface
- PopularTag.tsx      # Popular service tag
```

3. Section Components:
```
home/sections/
- WelcomeSection.tsx       # Welcome header
- CategoryGrid.tsx         # Service categories
- TestimonialsSection.tsx  # Testimonials
- TrustIndicatorsSection.tsx # Trust indicators
```

### 3. Implementation Timeline

#### Week 1: Setup & Structure
- [ ] Create directory structure
- [ ] Set up base components
- [ ] Implement core layouts

#### Week 2: Component Migration
- [ ] Migrate existing components
- [ ] Implement lazy loading
- [ ] Set up state management

#### Week 3: Optimization & Testing
- [ ] Performance optimization
- [ ] Testing implementation
- [ ] Documentation updates

#### Week 4: Review & Release
- [ ] Code review
- [ ] Performance validation
- [ ] Gradual rollout

### 4. Success Metrics

1. Performance
- [ ] 20% reduction in initial bundle size
- [ ] <3s First Contentful Paint
- [ ] <4s Time to Interactive

2. Code Quality
- [ ] Reduced component complexity
- [ ] Improved test coverage
- [ ] Better maintainability

3. User Experience
- [ ] Smooth loading transitions
- [ ] Consistent animation performance
- [ ] Improved mobile experience

### 5. Rollback Plan

1. Immediate Rollback Triggers
- Performance degradation >20%
- Critical user path disruption
- Mobile experience issues

2. Rollback Process
- Revert to main branch
- Restore original component
- Analyze failure points

3. Recovery Steps
- Identify issue source
- Implement fixes
- Gradual re-implementation

### 6. Future Considerations

1. Scalability
- Component reusability
- State management patterns
- Performance monitoring

2. Maintenance
- Documentation updates
- Performance benchmarks
- Testing strategy

3. Feature Addition
- Component extension points
- State management scaling
- Animation system flexibility

## Conclusion
This strategy provides a structured approach to code splitting while maintaining functionality and user experience. The phased implementation ensures careful validation at each step.