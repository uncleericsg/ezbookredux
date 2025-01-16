import type { AdminData } from '../../types/admin';

export interface AdminState {
  isAdmin: boolean;
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
}
