import type { AdminSettings } from './settings';
import type { BaseSettingsProps } from '@/types/components';

export interface AdminBookingsProps extends BaseSettingsProps<AdminSettings> {
  integrationStatus: Record<string, boolean>;
  onIntervalChange: () => void;
}

export interface AdminHeaderProps extends BaseSettingsProps<AdminSettings> {
  integrationStatus: Record<string, boolean>;
  onIntervalChange: () => void;
  loading: boolean;
  updateSettings: (settings: Partial<AdminSettings>) => void;
}

export interface AdminNavProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
}

export interface AdminPanelProps extends BaseSettingsProps<AdminSettings> {
  panelId: string;
  isActive: boolean;
}

export interface AdminTabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export interface AdminTableProps<T> {
  data: T[];
  columns: AdminTableColumn<T>[];
  loading?: boolean;
  error?: string | null;
  onRowClick?: (item: T) => void;
}

export interface AdminTableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string | number;
  sortable?: boolean;
}

export interface AdminFilterProps<T> {
  filters: T;
  onFilterChange: (filters: Partial<T>) => void;
  onReset: () => void;
}

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export interface AdminSortProps {
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;
}

export interface AdminActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export interface AdminErrorProps {
  error: string | Error;
  onRetry?: () => void;
}

export interface AdminLoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}
