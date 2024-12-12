import { startTransition } from 'react';

interface PreloadConfig {
  routes: string[];
  priority?: 'high' | 'low';
  timeout?: number;
}

class RoutePreloader {
  private preloadedRoutes: Set<string> = new Set();
  private observer: IntersectionObserver | null = null;

  constructor() {
    // Initialize intersection observer for viewport-based preloading
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const route = entry.target.getAttribute('data-route');
              if (route) {
                this.preloadRoute(route);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );
    }
  }

  preloadRoute = (route: string) => {
    if (this.preloadedRoutes.has(route)) return;

    startTransition(() => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
      this.preloadedRoutes.add(route);
    });
  };

  preloadRoutes = ({ routes, priority = 'low', timeout = 0 }: PreloadConfig) => {
    if (priority === 'high') {
      routes.forEach(this.preloadRoute);
    } else {
      // For low priority routes, delay preloading
      setTimeout(() => {
        startTransition(() => {
          routes.forEach(this.preloadRoute);
        });
      }, timeout);
    }
  };

  observeLink = (element: HTMLElement, route: string) => {
    if (this.observer) {
      element.setAttribute('data-route', route);
      this.observer.observe(element);
    }
  };

  disconnect = () => {
    if (this.observer) {
      this.observer.disconnect();
    }
  };
}

export const routePreloader = new RoutePreloader();
