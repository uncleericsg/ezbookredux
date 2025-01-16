import { useAppSelector } from './store';

// Service Selectors
export const useSelectedService = () => useAppSelector(state => state.service.selectedService);
export const useServiceCategories = () => useAppSelector(state => state.service.services);
export const useServiceLoading = () => useAppSelector(state => state.service.loading);
export const useServiceError = () => useAppSelector(state => state.service.error);

// Booking Selectors
export const useCurrentBooking = () => useAppSelector(state => state.booking.currentBooking);
export const useBookings = () => useAppSelector(state => state.booking.bookings);
export const useBookingFilters = () => useAppSelector(state => state.booking.filters);
export const useBookingLoading = () => useAppSelector(state => state.booking.loading);
export const useBookingError = () => useAppSelector(state => state.booking.error);

// User Selectors
export const useCurrentUser = () => useAppSelector(state => state.user.currentUser);
export const useUserLoading = () => useAppSelector(state => state.user.loading);
export const useUserError = () => useAppSelector(state => state.user.error);

// Auth Selectors
export const useAuthUser = () => useAppSelector(state => state.auth.user);
export const useAuthLoading = () => useAppSelector(state => state.auth.loading);
export const useAuthError = () => useAppSelector(state => state.auth.error);
export const useIsAuthenticated = () => useAppSelector(state => state.auth.isAuthenticated);
export const useAuthToken = () => useAppSelector(state => state.auth.token);
export const usePaymentStatus = () => useAppSelector(state => state.auth.paymentStatus);
export const useUserVerificationId = () => useAppSelector(state => state.auth.verificationId);
export const useUserPhone = () => useAppSelector(state => state.auth.phone);

// Admin Selectors
export const useIsAdmin = () => useAppSelector(state => state.admin.isAdmin);
export const useAdminData = () => useAppSelector(state => state.admin.adminData);
export const useAdminLoading = () => useAppSelector(state => state.admin.loading);
export const useAdminError = () => useAppSelector(state => state.admin.error);
