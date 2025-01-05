/**
 * Performance monitoring utilities for Core Web Vitals and custom metrics
 */

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: 2500,    // Largest Contentful Paint (ms)
  FID: 100,     // First Input Delay (ms)
  CLS: 0.1,     // Cumulative Layout Shift
  TTI: 3000,    // Time to Interactive (ms)
  FCP: 1800     // First Contentful Paint (ms)
};

// Critical elements to monitor
const ELEMENTS = {
  LCP: ['video', 'img.hero'],
  FID: ['button', 'a'],
  CLS: ['.category-grid', '.testimonials']
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  // LCP Observer
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lcpEntry = entries[entries.length - 1];
    const lcpValue = lcpEntry.startTime;
    
    console.log('LCP:', lcpValue);
    if (lcpValue > THRESHOLDS.LCP) {
      console.warn(`LCP exceeds threshold: ${lcpValue}ms`);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // FID Observer
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      // Type assertion since we know this is a first-input entry
      const fidEntry = entry as PerformanceEventTiming;
      const fidValue = fidEntry.processingStart - fidEntry.startTime;
      
      console.log('FID:', fidValue);
      if (fidValue > THRESHOLDS.FID) {
        console.warn(`FID exceeds threshold: ${fidValue}ms`);
      }
    });
  }).observe({ entryTypes: ['first-input'] });

  // CLS Observer
  new PerformanceObserver((list) => {
    list.getEntries().forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        const clsValue = entry.value;
        
        console.log('CLS:', clsValue);
        if (clsValue > THRESHOLDS.CLS) {
          console.warn(`CLS exceeds threshold: ${clsValue}`);
        }
      }
    });
  }).observe({ entryTypes: ['layout-shift'] });
};

/**
 * Track component render time
 */
export const trackRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${componentName} render time:`, duration);
    
    // Report if render time is significant
    if (duration > 100) {
      console.warn(`Slow render detected in ${componentName}: ${duration}ms`);
    }
  };
};

/**
 * Track interaction metrics
 */
export const trackInteraction = (actionName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${actionName} interaction time:`, duration);
    
    // Report if interaction is slow
    if (duration > 50) {
      console.warn(`Slow interaction detected in ${actionName}: ${duration}ms`);
    }
  };
};

/**
 * Track resource loading
 */
export const trackResourceLoad = (resourceName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(`${resourceName} load time:`, duration);
    
    // Report if loading is slow
    if (duration > 1000) {
      console.warn(`Slow resource load detected for ${resourceName}: ${duration}ms`);
    }
  };
};

/**
 * Initialize all performance tracking
 */
export const initializeTracking = () => {
  // Initialize Core Web Vitals monitoring
  initPerformanceMonitoring();

  // Track page load
  const cleanup = trackRenderTime('HomePage');

  // Return cleanup function
  return () => {
    cleanup();
    // Additional cleanup if needed
  };
};