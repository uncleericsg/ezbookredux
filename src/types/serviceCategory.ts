import { LucideIcon } from 'lucide-react';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
}
