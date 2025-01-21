import type { AppointmentType } from '@shared/types/appointment';

export type VisibilityType = 'all' | 'amc';

export interface CardSettings {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  visible: boolean;
  visibilityType: VisibilityType;
  imageUrl?: string;
  appointmentTypeId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  type: 'maintenance' | 'repair' | 'amc';
  price: number | null;
  icon?: string;
  visible: boolean;
  order: number;
  parentId?: string;
  appointmentTypeId?: string;
  visibilityType?: VisibilityType;
}

export interface CategoryWithChildren extends ServiceCategory {
  children: CategoryWithChildren[];
}

export interface HomepageSettings {
  cards: CardSettings[];
  categories: ServiceCategory[];
}

export interface CategoryMappingModalProps {
  category: ServiceCategory;
  appointmentTypes: AppointmentType[];
  onClose: () => void;
  onSave: (appointmentTypeId: string) => void;
}

export interface DragEndResult {
  draggableId: string;
  type: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  };
}

export interface CategoryDragItem {
  id: string;
  type: string;
  index: number;
  parentId?: string;
}

export interface CardDragItem {
  id: string;
  type: string;
  index: number;
}

export interface CategoryUpdatePayload {
  name?: string;
  description?: string;
  visibilityType?: VisibilityType;
  appointmentTypeId?: string;
  visible?: boolean;
  order?: number;
  parentId?: string;
}

export interface CardUpdatePayload {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  appointmentTypeId?: string;
  visible?: boolean;
  order?: number;
  visibilityType?: VisibilityType;
}