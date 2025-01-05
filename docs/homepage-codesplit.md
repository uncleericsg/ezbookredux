# Homepage Code Splitting Strategy Document

## Overview
This document outlines the comprehensive strategy for code splitting the homepage (ServiceCategorySelection) component of the iAircon EasyBooking application.

## Current Analysis

### 1. Component Structure
Current location: `src/components/ServiceCategorySelection.tsx`

#### Dependencies
```typescript
// External Dependencies
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { AirVent, Wrench, ShieldCheck, Star, Calendar, CheckCircle, 
         Shield, Clock, Timer, Users, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

// Internal Dependencies
import { ROUTES } from '@config/routes';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useServiceHistory } from '@hooks/useServiceHistory';
import { useServiceRating } from '@hooks/useServiceRating';
import { useAppSelector } from '../store/hooks';
```

#### Already Lazy Loaded Components
```typescript
const TrustIndicators = lazy(() => import('@components/TrustIndicators'));
const ServiceRating = lazy(() => import('@components/ServiceRating'));
const FloatingButtons = lazy(() => import('@components/FloatingButtons'));
```

### 2. Core Features & Logic

#### State Management
- Redux integration for user state
- Local state for:
  - Rating display
  - Testimonials shuffling
  - Motion preferences

#### Custom Hooks Usage
- useMediaQuery: Motion preference detection
- useServiceHistory: User service history
- useServiceRating: Rating submission
- useAppSelector: Redux state access

#### Business Logic
1. Category Selection
   - Dynamic category list based on user type (AMC status)
   - Navigation handling with state preservation
   - Category-specific routing

2. Rating System
   - User authentication check
   - Rating submission handling
   - Feedback collection

3. Testimonials Management
   - Testimonial shuffling
   - Infinite scroll animation
   - Interactive display

### 3. UI Components

#### Main Sections
1. Header Section
   - Welcome message
   - Subtitle
   - Animation effects

2. Service Categories Grid
   - Dynamic category cards
   - Popular tag handling
   - Responsive grid layout
   - Interactive animations

3. Trust Indicators
   - Lazy loaded section
   - Social proof elements

4. Testimonials Section
   - Infinite scroll
   - Interactive cards
   - Rating display
   - Animation effects

5. Floating Actions
   - Dynamic button display
   - Authentication integration

### 4. Performance Considerations

#### Current Pain Points
1. Large bundle size due to:
   - Framer Motion animations
   - Multiple icon imports
   - Complex UI components

2. Render Performance:
   - Multiple animation effects
   - Complex state management
   - Dynamic styling calculations

3. Layout Stability:
   - Multiple async components
   - Dynamic content loading
   - Animation-heavy sections

## Code Splitting Strategy

### Phase 1: Component Separation

#### 1. Create Base Directory Structure
```
src/
  components/
    home/
      layout/
      features/
      sections/
      hooks/
      utils/
```

#### 2. Component Breakdown
1. Layout Components:
```typescript
// home/layout/
- HomeLayout.tsx
- HomeHeader.tsx
- HomeContainer.tsx
```

2. Feature Components:
```typescript
// home/features/
- CategoryCard.tsx
- TestimonialCard.tsx
- RatingModal.tsx
- PopularTag.tsx
```

3. Section Components:
```typescript
// home/sections/
- WelcomeSection.tsx
- CategoryGrid.tsx
- TestimonialsSection.tsx
- TrustIndicatorsSection.tsx
```

4. Custom Hooks:
```typescript
// home/hooks/
- useHomeNavigation.ts
- useTestimonials.ts
- useCategorySelection.ts
```

5. Utilities:
```typescript
// home/utils/
- animations.ts
- categoryUtils.ts
- testimonialUtils.ts
```

### Phase 2: Implementation Steps

1. Component Migration
```typescript
// Step 1: Create base components
export const HomePage = lazy(() => import('./home/HomePage'));

// Step 2: Section splitting
const WelcomeSection = lazy(() => import('./home/sections/WelcomeSection'));
const CategorySection = lazy(() => import('./home/sections/CategorySection'));
const TestimonialsSection = lazy(() => import('./home/sections/TestimonialsSection'));
```

2. State Management Optimization
```typescript
// Centralize state management
const useHomeState = () => {
  const [state, dispatch] = useReducer(homeReducer, initialState);
  return { state, dispatch };
};
```

3. Performance Optimizations
```typescript
// Implement chunked loading
const ChunkedSection = ({ children, priority }) => {
  const { inView } = useInView();
  return (
    <Suspense fallback={<LoadingPlaceholder priority={priority} />}>
      {inView && children}
    </Suspense>
  );
};
```

### Phase 3: Testing & Validation

1. Performance Metrics
- Bundle size analysis
- Load time measurements
- Core Web Vitals tracking
- Animation performance

2. User Experience Testing
- Loading sequences
- Animation smoothness
- Interactive elements
- Mobile responsiveness

3. Error Handling
- Suspense boundaries
- Error boundaries
- Fallback states
- Loading states

## Implementation Timeline

### Week 1: Setup & Structure
- Create new directory structure
- Set up base components
- Implement core layouts

### Week 2: Component Migration
- Migrate existing components
- Implement lazy loading
- Set up state management

### Week 3: Optimization & Testing
- Performance optimization
- Testing implementation
- Documentation updates

### Week 4: Review & Release
- Code review
- Performance validation
- Gradual rollout

## Success Metrics

1. Performance
- 20% reduction in initial bundle size
- <3s First Contentful Paint
- <4s Time to Interactive

2. Code Quality
- Reduced component complexity
- Improved test coverage
- Better maintainability

3. User Experience
- Smooth loading transitions
- Consistent animation performance
- Improved mobile experience

## Rollback Plan

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

## Future Considerations

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
This code splitting strategy aims to improve the homepage's performance while maintaining its functionality and user experience. The phased approach allows for careful implementation and validation at each step, ensuring a smooth transition to the new architecture.