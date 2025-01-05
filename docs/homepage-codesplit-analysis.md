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

### B. Navigation & State Management

1. Navigation Flow
```typescript
// Forward Navigation
const handleCategorySelect = (categoryId: string) => {
  const state = {
    from: '/',
    timestamp: Date.now(),
    selectedCategory: categories.find(c => c.id === categoryId)?.name
  };
  navigate(routes[categoryId], { state });
};

// Return Path Handling
const handleReturn = () => {
  const { state } = location;
  if (state?.from === '/') {
    navigate('/', { replace: true });
  } else {
    navigate(-1);
  }
};

// Login Redirect
const handleProtectedRoute = () => {
  const returnUrl = location.pathname + location.search;
  navigate('/login', { state: { returnUrl } });
};
```

2. Category-Specific Behaviors
```typescript
// Validation Rules
const categoryValidation = {
  regular: {
    requiresHistory: true,
    minVisits: 1
  },
  'powerjet-chemical': {
    requiresHistory: false,
    hasWarranty: true
  },
  'gas-leak': {
    isEmergency: true,
    priorityLevel: 'high'
  },
  amc: {
    requiresSubscription: true,
    checkServiceDue: true
  }
};

// Form Fields
const categoryFields = {
  regular: ['unitCount', 'lastServiceDate'],
  'powerjet-chemical': ['unitCount', 'warrantyStatus'],
  'gas-leak': ['symptoms', 'urgencyLevel'],
  amc: ['contractNumber', 'nextServiceDate']
};
```

3. Navigation State
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

2. User State Dependencies
```typescript
// Authentication State
const { currentUser } = useAppSelector((state: RootState) => state.user);
const isAmcCustomer = currentUser?.amcStatus === 'active';

// Service History
const { visits } = useServiceHistory(currentUser?.id || '');

// Rating State
const { submitRating } = useServiceRating();
const [showRating, setShowRating] = useState(false);
```

3. UI State Management
```typescript
// Animation Controls
const shouldReduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
const [videoLoaded, setVideoLoaded] = useState(false);
const [videoError, setVideoError] = useState(false);

// Content Management
const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);
const [currentIndex, setCurrentIndex] = useState(0);
```

4. Route Protection
```typescript
// Protected Route Handling
const handleProtectedAction = () => {
  if (!currentUser) {
    navigate('/login', {
      state: { returnUrl: location.pathname }
    });
    return;
  }
  // Proceed with action
};
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

### B. Core Component Features

1. Video Background Management
```typescript
// State
const [videoLoaded, setVideoLoaded] = useState(false);
const [videoError, setVideoError] = useState(false);

// Error Handling
const handleVideoError = () => {
  setVideoError(true);
  // Fallback to static background
  document.body.style.backgroundImage = 'url("/images/video-poster.jpg")';
};

// Loading Management
const handleVideoLoad = () => {
  setVideoLoaded(true);
  // Remove static background
  document.body.style.backgroundImage = 'none';
};
```

2. Testimonials Management
```typescript
// State & Configuration
const [shuffledTestimonials, setShuffledTestimonials] = useState<Testimonial[]>([]);
const DISPLAY_DURATION = 6000; // 6 seconds per rating

// Shuffle Logic
const shuffleArray = useCallback((array: Testimonial[]): Testimonial[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}, []);

// Auto-rotation
useEffect(() => {
  const interval = setInterval(() => {
    if (paused) return;
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  }, DISPLAY_DURATION);
  return () => clearInterval(interval);
}, [testimonials.length, paused]);
```

3. Category Management
```typescript
// Dynamic Category Order
const categories = useMemo(() => {
  const baseCategories = [
    {
      id: 'regular',
      name: 'Return Customers Booking',
      popular: true,
      rating: 4.8,
      reviewCount: 1250
    },
    // ... other categories
  ];

  // AMC Customer Special Handling
  if (isAmcCustomer) {
    baseCategories.unshift({
      id: 'amc',
      name: 'AMC Service Visit',
      rating: 4.9,
      reviewCount: 320
    });
  }

  return baseCategories;
}, [isAmcCustomer]);

// Category Selection Logic
const handleCategorySelect = useCallback((categoryId: string) => {
  window.scrollTo(0, 0);
  const selectedCategory = categories.find(c => c.id === categoryId)?.name || '';
  const state = {
    from: '/',
    timestamp: Date.now(),
    selectedCategory
  };
  
  // Route mapping
  const routes = {
    regular: ROUTES.BOOKING.RETURN_CUSTOMER,
    'powerjet-chemical': ROUTES.BOOKING.POWERJET_CHEMICAL,
    'gas-leak': ROUTES.BOOKING.GAS_LEAK,
    default: ROUTES.PRICING
  };
  
  navigate(routes[categoryId] || routes.default, { state });
}, [navigate, categories]);
```

### C. ServiceCategoryCard
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

// Motion Preferences
const getAnimationProps = (shouldReduceMotion: boolean) => ({
  initial: shouldReduceMotion ? {} : { opacity: 0, y: 20 },
  whileInView: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  whileHover: shouldReduceMotion ? {} : { y: -5 }
});

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

## 6. Additional Components

### A. Utility Components
```typescript
// ScrollToTop
- Scroll position management
- Smooth scrolling behavior
- Visibility threshold control

// WhatsAppButton
- Click tracking
- Dynamic number configuration
- Mobile/Desktop behavior

// ServiceDueBanner
- Due date calculations
- Priority level indicators
- Notification integration
```

### B. Modal Components
```typescript
// LoginModal
- Authentication state management
- Form validation
- Error handling
- Redirect management

// RatingConfirmationModal
- Rating submission
- Feedback collection
- Success/Error states
- Google review integration

// AMCStatusCard
- Subscription status
- Service history
- Next service date
- Renewal notifications
```

### C. Integration Points
1. Authentication Flow
```typescript
// Login State Management
const handleLogin = async () => {
  setLoading(true);
  try {
    await loginUser();
    closeModal();
    refreshUserData();
  } catch (error) {
    handleError(error);
  }
};
```

2. Service Management
```typescript
// AMC Status Updates
const checkServiceDue = () => {
  const nextService = getNextServiceDate(lastService);
  const isDue = isServiceDue(nextService);
  setShowBanner(isDue);
};
```

3. Communication Channels
```typescript
// WhatsApp Integration
const openWhatsApp = () => {
  const message = encodeURIComponent(
    `Hi, I'm interested in booking a service.`
  );
  window.open(`https://wa.me/${phoneNumber}?text=${message}`);
};
```

## 7. Implementation Notes

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

## 8. Additional Considerations

### A. Accessibility
```typescript
// ARIA Labels
const ariaLabels = {
  categoryCard: (name: string) => `Book ${name} service`,
  ratingButton: 'Rate our service',
  testimonialSection: 'Customer testimonials',
  videoBackground: 'Decorative background video'
};

// Keyboard Navigation
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleSelect();
  }
};

// Focus Management
useEffect(() => {
  if (modalOpen) {
    modalRef.current?.focus();
    return () => lastFocusedElement?.focus();
  }
}, [modalOpen]);
```

### B. SEO Optimization
```typescript
// Meta Tags
const metaTags = {
  title: 'iAircon Easy Booking - Professional Aircon Services',
  description: 'Book professional aircon services in Singapore. Chemical wash, gas top-up, and maintenance services available.',
  keywords: 'aircon service, chemical wash, gas top-up, Singapore'
};

// Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'iAircon Easy Booking',
  provider: {
    '@type': 'LocalBusiness',
    name: 'iAircon Services',
    areaServed: 'Singapore'
  }
};
```

### C. Mobile Responsiveness
```typescript
// Breakpoint Management
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

// Touch Interactions
const touchHandlers = {
  onTouchStart: (e: TouchEvent) => setTouchStart(e.touches[0].clientY),
  onTouchMove: (e: TouchEvent) => handleTouchMove(e.touches[0].clientY),
  onTouchEnd: () => finalizeTouchInteraction()
};

// Responsive Layout
const layoutClasses = {
  container: 'px-4 sm:px-6 lg:px-8',
  grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  card: 'w-full min-w-[280px] md:w-[320px] lg:w-[300px]'
};
```

### D. Performance Metrics
```typescript
// Core Web Vitals
const vitalsConfig = {
  LCP: {
    threshold: 2500,
    elements: ['video', 'img.hero']
  },
  FID: {
    threshold: 100,
    elements: ['button', 'a']
  },
  CLS: {
    threshold: 0.1,
    elements: ['.category-grid', '.testimonials']
  }
};

// Performance Monitoring
const trackMetrics = () => {
  // LCP
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcpEntry = entries[entries.length - 1];
    console.log('LCP:', lcpEntry.startTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });
};
```