import { LucideIcon } from 'lucide-react';

export interface AdminTabConfig {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
}

export interface AdminState {
  activeTab: number;
  collapsed: boolean;
}

export interface AdminAction {
  type: string;
  payload?: any;
}

export type AdminTab = string;
