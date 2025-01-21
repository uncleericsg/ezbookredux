export interface ServiceDetails {
  id: string;
  title: string;
  price: number;
  duration: string;
  description: string;
  usualPrice?: number;
  appointmentTypeId: string;
  isPremium?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  services: ServiceDetails[];
}

export interface ServicePricing {
  id: string;
  serviceId: string;
  price: number;
  usualPrice?: number;
  currency: string;
  isPremium?: boolean;
  validFrom: string;
  validTo?: string;
}

export interface ServiceDuration {
  value: number;
  unit: 'minutes' | 'hours';
}

export interface ServiceAvailability {
  id: string;
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  pricing: ServicePricing;
  duration: ServiceDuration;
  availability: ServiceAvailability[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
} 