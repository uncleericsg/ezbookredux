// @ai-doc Routes configuration file
// Contains all route definitions and their properties

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PRICING: '/service-pricing',
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
    ROOT: '/booking',
    FIRST_TIME: '/booking/first-time',
    SERVICE: '/booking/service',
    CONFIRMATION: '/booking/confirmation/:bookingId',
    RETURN_CUSTOMER: '/booking/return-customer',
    PRICE_SELECTION: '/booking/price-selection',
    POWERJET_CHEMICAL: '/booking/powerjet-chemical-wash',
    GAS_LEAK: '/booking/gas-check-leak',
    NEW: '/booking/new'
  },
  AMC: {
    PACKAGES: '/amc/packages',
    SUBSCRIPTION: '/amc/subscription-flow',
    SIGNUP: '/amc/signup'
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
  ROUTES.BOOKING.CONFIRMATION,
  ROUTES.BOOKING.NEW
];

// Routes that should not show the main navigation
export const ROUTES_WITHOUT_NAVBAR = [
  ROUTES.LOGIN,
  ROUTES.PRICING,
  ROUTES.BOOKING.PRICE_SELECTION,
  ROUTES.AMC.SIGNUP,
  ROUTES.BOOKING.NEW,
  ROUTES.BOOKING.CONFIRMATION,
  ROUTES.BOOKING.RETURN_CUSTOMER,
  ROUTES.BOOKING.POWERJET_CHEMICAL,
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
  [ROUTES.LOGIN]: {
    title: 'Login',
    breadcrumb: 'Login',
  },
  [ROUTES.BOOKING.PRICE_SELECTION]: {
    title: 'Select Price',
    breadcrumb: 'Price Selection',
  },
  [ROUTES.AMC.SIGNUP]: {
    title: 'AMC Signup',
    breadcrumb: 'AMC Signup',
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
  [ROUTES.BOOKING.POWERJET_CHEMICAL]: {
    title: 'PowerJet Chemical Wash',
    breadcrumb: 'PowerJet Chemical Wash',
  },
} as const;
