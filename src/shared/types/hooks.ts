import type { BookingResult } from './booking';

export interface UseBookingResult {
  loading: boolean;
  error: string | null;
  fetchBookingsByEmail: (email: string) => Promise<BookingResult>;
}

export interface UseAuthResult {
  user: {
    email?: string;
    id?: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export interface UseSettingsResult<T> {
  settings: T;
  loading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<T>) => Promise<void>;
}

export interface UseLoadingResult {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export interface UseErrorResult {
  error: string | null;
  setError: (error: string | null) => void;
}

export interface UseToastResult {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export interface UsePaginationResult {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export interface UseFilterResult<T> {
  filters: T;
  setFilters: (filters: Partial<T>) => void;
  resetFilters: () => void;
}

export interface UseSortResult {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  setSortBy: (field: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}
