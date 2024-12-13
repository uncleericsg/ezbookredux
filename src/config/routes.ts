// @ai-doc Routes configuration file
// Contains all route definitions and their properties

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SERVICES: '/admin/services',
    TEAMS: '/admin/teams',
    NOTIFICATIONS: '/admin/notifications',
    HOMEPAGE: '/admin/homepage',
    AMC: '/admin/amc',
    ANALYTICS: '/admin/analytics',
    BRANDING: '/admin/branding',
    PUSH: '/admin/push',
    SETTINGS: '/admin/settings'
  },
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  NOTIFICATIONS: '/notifications',
  BOOKING: {
    FIRST_TIME: '/booking/first-time',
    SERVICE: '/booking/service',
  },
  AMC: {
    PACKAGES: '/amc/packages',
    SUBSCRIPTION: '/amc/subscription-flow',
  },
} as const;

// Routes that require authentication
export const PROTECTED_ROUTES = [
  ROUTES.ADMIN.ROOT,
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.SERVICES,
  ROUTES.ADMIN.TEAMS,
  ROUTES.ADMIN.NOTIFICATIONS,
  ROUTES.ADMIN.HOMEPAGE,
  ROUTES.ADMIN.AMC,
  ROUTES.ADMIN.ANALYTICS,
  ROUTES.ADMIN.BRANDING,
  ROUTES.ADMIN.PUSH,
  ROUTES.ADMIN.SETTINGS,
  ROUTES.PROFILE,
  ROUTES.DASHBOARD,
  ROUTES.NOTIFICATIONS,
];

// Routes that should not show the main navigation
export const ROUTES_WITHOUT_NAVBAR = [
  ROUTES.LOGIN,
  ROUTES.ADMIN.ROOT,
  ROUTES.ADMIN.DASHBOARD,
  ROUTES.ADMIN.USERS,
  ROUTES.ADMIN.SERVICES,
  ROUTES.ADMIN.TEAMS,
  ROUTES.ADMIN.NOTIFICATIONS,
  ROUTES.ADMIN.HOMEPAGE,
  ROUTES.ADMIN.AMC,
  ROUTES.ADMIN.ANALYTICS,
  ROUTES.ADMIN.BRANDING,
  ROUTES.ADMIN.PUSH,
  ROUTES.ADMIN.SETTINGS,
];

// Routes that require specific roles
export const ROLE_PROTECTED_ROUTES = {
  ADMIN: [
    ROUTES.ADMIN.ROOT,
    ROUTES.ADMIN.DASHBOARD,
    ROUTES.ADMIN.USERS,
    ROUTES.ADMIN.SERVICES,
    ROUTES.ADMIN.TEAMS,
    ROUTES.ADMIN.NOTIFICATIONS,
    ROUTES.ADMIN.HOMEPAGE,
    ROUTES.ADMIN.AMC,
    ROUTES.ADMIN.ANALYTICS,
    ROUTES.ADMIN.BRANDING,
    ROUTES.ADMIN.PUSH,
    ROUTES.ADMIN.SETTINGS,
  ],
  TECH: ['/tech'],
  AMC: ['/amc/dashboard'],
};

// Route metadata for breadcrumbs and titles
export const ROUTE_METADATA = {
  [ROUTES.HOME]: {
    title: 'Home',
    breadcrumb: 'Home',
  },
  [ROUTES.ADMIN.ROOT]: {
    title: 'Admin Dashboard',
    breadcrumb: 'Admin',
  },
  [ROUTES.ADMIN.USERS]: {
    title: 'User Management',
    breadcrumb: 'Users',
  },
  [ROUTES.ADMIN.SERVICES]: {
    title: 'Service Management',
    breadcrumb: 'Services',
  },
  [ROUTES.ADMIN.TEAMS]: {
    title: 'Team Management',
    breadcrumb: 'Teams',
  },
  [ROUTES.ADMIN.NOTIFICATIONS]: {
    title: 'Notification Manager',
    breadcrumb: 'Notifications',
  },
  [ROUTES.ADMIN.ANALYTICS]: {
    title: 'Analytics',
    breadcrumb: 'Analytics',
  },
  [ROUTES.ADMIN.SETTINGS]: {
    title: 'Settings',
    breadcrumb: 'Settings',
  },
  [ROUTES.PROFILE]: {
    title: 'User Profile',
    breadcrumb: 'Profile',
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
  },
  [ROUTES.NOTIFICATIONS]: {
    title: 'Notifications',
    breadcrumb: 'Notifications',
  },
  [ROUTES.BOOKING.FIRST_TIME]: {
    title: 'First Time Booking',
    breadcrumb: 'First Time Booking',
  },
  [ROUTES.AMC.PACKAGES]: {
    title: 'AMC Packages',
    breadcrumb: 'AMC Packages',
  },
} as const;
