# Homepage Component Analysis & Implementation Details

## 1. Component Structure Analysis

### A. ServiceCategorySelection
```typescript
// Core Dependencies
import { motion } from 'framer-motion';
import { AirVent, Wrench, ShieldCheck } from 'lucide-react';
import { useServiceHistory, useServiceRating } from '@hooks';

// State Management
const [showRating, setShowRating] = useState(false);
const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);
const { visits } = useServiceHistory(currentUser?.id || '');
const isAmcCustomer = currentUser?.amcStatus === 'active';
```

### B. Navigation State
```typescript
interface NavigationState {
  from: string;        // Source path
  timestamp: number;   // Navigation timestamp
  selectedCategory: string;  // Selected category name
}

// Category-specific routing
if (categoryId === 'regular') {
  navigate(ROUTES.BOOKING.RETURN_CUSTOMER, { state });
} else if (categoryId === 'powerjet-chemical') {
  navigate(ROUTES.BOOKING.POWERJET_CHEMICAL, { state });
} else if (categoryId === 'gas-leak') {
  navigate(ROUTES.BOOKING.GAS_LEAK, { state });
}
```

## 2. Component-Specific Details

### A. RatingsDisplay
```typescript
// Configuration
const DISPLAY_DURATION = 6000; // 6 seconds per rating

// Animation Patterns
const animationVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Features
- Auto-rotating display
- Pause on hover
- Click to rate
- Google review integration
```

### B. ServiceCategoryCard
```typescript
interface ServiceCategoryCardProps {
  category: ServiceCategory;
  onSelect: () => void;
  shouldReduceMotion: boolean;
}

// Styling System
const categoryStyles = {
  regular: {
    bg: 'from-amber-600/50 to-[#1a365d]/70',
    border: 'border-amber-500/50',
    hover: 'hover:border-amber-400/70'
  },
  'powerjet-chemical': {
    bg: 'from-blue-500/50 to-cyan-900/70',
    border: 'border-cyan-400/50',
    hover: 'hover:border-cyan-300/70'
  }
};

// Animation System
const cardAnimations = {
  entry: { opacity: 0, y: 20 },
  hover: { y: -5 },
  tap: { scale: 0.98 }
};
```

## 3. CSS Architecture

### A. Base Container
```css
.serviceCategoryContainer {
  background: linear-gradient(225deg, #010102 0%, #060d1a 100%);
  min-height: calc(100vh - 64px);
}

// Gradient Overlay
.serviceCategoryContainer::before {
  background: 
    radial-gradient(circle at top left, rgba(45, 212, 191, 0.1) 0%, transparent 35%),
    linear-gradient(225deg, #010101 0%, #081224 100%);
  opacity: 0.9;
}
```

### B. Animation Classes
```css
// Entry Animations
.fadeInUp {
  animation: fadeInUp 0.8s ease-out;
}

// Hover Effects
.hoverScale {
  transition: transform 0.3s ease;
}
.hoverScale:hover {
  transform: scale(1.05);
}
```

## 4. Data Management

### A. Mock Data Strategy
```typescript
// Development Mode
if (import.meta.env.DEV) {
  const shuffledRatings = [...MOCK_RATINGS]
    .sort(() => Math.random() - 0.5)
    .filter(r => r.rating >= 4)
    .slice(0, 10);
}

// Production Mode
const response = await fetch('/api/ratings/recent');
```

### B. Category Management
```typescript
const categories = useMemo(() => {
  const baseCategories = [
    {
      id: 'regular',
      name: 'Return Customers Booking',
      popular: true
    },
    {
      id: 'powerjet-chemical',
      name: 'PowerJet Chemical Wash'
    }
  ];
  
  if (isAmcCustomer) {
    baseCategories.unshift({
      id: 'amc',
      name: 'AMC Service Visit'
    });
  }
  
  return baseCategories;
}, [isAmcCustomer]);
```

## 5. Performance Optimizations

### A. Lazy Loading
```typescript
// Already Implemented
const TrustIndicators = lazy(() => import('@components/TrustIndicators'));
const ServiceRating = lazy(() => import('@components/ServiceRating'));
const FloatingButtons = lazy(() => import('@components/FloatingButtons'));

// To Be Implemented
const WelcomeSection = lazy(() => import('./sections/WelcomeSection'));
const CategoryGrid = lazy(() => import('./sections/CategoryGrid'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
```

### B. Animation Performance
```typescript
// Conditional Animations
initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}

// Optimized Infinite Scroll
animate={{ x: '-66.666%' }}
transition={{
  duration: 80,
  repeat: Infinity,
  ease: 'linear',
  repeatType: "loop"
}}
```

## 6. Implementation Notes

### A. Critical Dependencies
- framer-motion: Animation system
- lucide-react: Icon components
- date-fns: Date formatting
- sonner: Toast notifications

### B. State Management
- Redux for user authentication
- Local state for UI interactions
- Memoization for expensive computations

### C. Error Boundaries
- Implement at section level
- Fallback UI for each section
- Error reporting integration

### D. Testing Considerations
- Component isolation
- Animation testing
- Mock data consistency
- Navigation state preservation