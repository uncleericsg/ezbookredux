// @ai-doc Routes configuration file
// Contains all route definitions and their properties

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    BOOKINGS: '/admin/bookings',
    SETTINGS: '/admin/settings',
    SERVICES: '/admin/services',
    TEAMS: '/admin/teams',
    NOTIFICATIONS: '/admin/notifications',
    HOMEPAGE: '/admin/homepage',
    AMC: '/admin/amc',
    ANALYTICS: '/admin/analytics',
    BRANDING: '/admin/branding',
    PUSH: '/admin/push'
  },
  BOOKING: {
    ROOT: '/booking',
    NEW: '/booking/new',
    CONFIRM: '/booking/confirm',
    SUCCESS: '/booking/success',
    FIRST_TIME: '/booking/first-time',
    POWERJET_CHEMICAL: '/booking/powerjet-chemical',
    GAS_LEAK: '/booking/gas-leak',
    PRICE_SELECTION: '/booking/price-selection',
    CONFIRMATION: '/booking/confirmation'
  },
  SERVICES: {
    ROOT: '/services',
    HISTORY: '/services/history',
    SCHEDULE: '/services/schedule'
  },
  PAYMENTS: {
    ROOT: '/payments',
    HISTORY: '/payments/history',
    SUCCESS: '/payments/success',
    CANCEL: '/payments/cancel'
  },
  AMC: {
    ROOT: '/amc',
    SIGNUP: '/amc/signup',
    SUBSCRIPTION: '/amc/subscription',
    PACKAGES: '/amc/packages',
    DASHBOARD: '/amc/dashboard'
  },
  NOTIFICATIONS: '/notifications'
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
  // Authentication
  ROUTES.LOGIN,
  
  // First Time Customer Flow
  ROUTES.BOOKING.FIRST_TIME,
  ROUTES.BOOKING.PRICE_SELECTION,
  ROUTES.BOOKING.POWERJET_CHEMICAL,
  ROUTES.BOOKING.GAS_LEAK,
  
  // AMC Flow
  ROUTES.AMC.SIGNUP,
  ROUTES.AMC.SUBSCRIPTION,
  
  // Admin Routes
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
  [ROUTES.ADMIN.HOMEPAGE]: {
    title: 'Homepage Manager',
    breadcrumb: 'Homepage',
  },
  [ROUTES.ADMIN.AMC]: {
    title: 'AMC Management',
    breadcrumb: 'AMC',
  },
  [ROUTES.ADMIN.BRANDING]: {
    title: 'Branding Settings',
    breadcrumb: 'Branding',
  },
  [ROUTES.ADMIN.PUSH]: {
    title: 'Push Notifications',
    breadcrumb: 'Push',
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
