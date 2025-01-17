export const ROUTES = {
  ROOT: '/',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  ADMIN: {
    ROOT: '/admin',
    BOOKINGS: '/admin/bookings',
    SETTINGS: '/admin/settings',
  },
  PAYMENTS: {
    ROOT: '/payments',
    HISTORY: '/payments/history',
    SUCCESS: '/payments/success',
    CANCEL: '/payments/cancel',
  },
  BOOKING: {
    ROOT: '/booking',
    NEW: '/booking/new',
    CONFIRM: '/booking/confirm',
    SUCCESS: '/booking/success',
    POWERJET_CHEMICAL: '/booking/powerjet-chemical',
    GAS_LEAK: '/booking/gas-leak',
  },
} as const;

export type Routes = typeof ROUTES; 