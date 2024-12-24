// Base admin data type
export interface AdminData {
  id: number;
  name: string;
}

// Admin state interface
export interface AdminState {
  isAdmin: boolean;
  adminData: AdminData | null;
  loading: boolean;
  error: string | null;
}

// Admin action payloads
export interface SetAdminPayload {
  isAdmin: boolean;
}

export interface SetAdminDataPayload {
  adminData: AdminData;
}

export interface SetAdminErrorPayload {
  error: string;
}

// Admin thunk types
export interface AdminThunkConfig {
  state: { admin: AdminState };
  rejectValue: string;
}
