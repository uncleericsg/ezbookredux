export type ServiceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceVisit {
  id: string;
  bookingId: string;
  technicianId: string | null;
  status: ServiceStatus;
  scheduledAt: string;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceReport {
  id: string;
  visitId: string;
  findings: string[];
  recommendations: string[];
  images?: string[];
  createdAt: string;
}

export interface ServiceInvoice {
  id: string;
  visitId: string;
  amount: number;
  currency: string;
  isPaid: boolean;
  dueDate: string;
  createdAt: string;
}

export interface ServiceLocation {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
} 