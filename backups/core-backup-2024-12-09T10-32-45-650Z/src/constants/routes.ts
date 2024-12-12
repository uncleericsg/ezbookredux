export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  
  // Customer routes
  CUSTOMER: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    NOTIFICATIONS: '/notifications',
    BOOKING: {
      NEW: '/booking/new',
      FIRST_TIME: '/booking/first-time',
      SERVICE: '/booking/service',
      CONFIRMATION: '/booking/confirmation'
    },
    AMC: {
      PACKAGES: '/amc/packages',
      SUBSCRIPTION: '/amc/subscription-flow'
    }
  },
  
  // Admin routes
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    NOTIFICATIONS: '/admin/notifications',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings',
    SERVICES: '/admin/services',
    TEAMS: '/admin/teams'
  }
} as const;

export type RouteKeys = typeof ROUTES;
export type CustomerRouteKeys = typeof ROUTES.CUSTOMER;
export type AdminRouteKeys = typeof ROUTES.ADMIN;
