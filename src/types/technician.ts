export type TechnicianStatus = 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
export type TechnicianLevel = 'JUNIOR' | 'SENIOR' | 'MASTER';
export type ServiceArea = 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'CENTRAL';

export interface TechnicianProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  level: TechnicianLevel;
  status: TechnicianStatus;
  serviceAreas: ServiceArea[];
  rating: number;
  totalJobs: number;
  completedJobs: number;
  specializations: string[];
  certifications: string[];
  availability: {
    startTime: string; // ISO time string
    endTime: string; // ISO time string
    daysOff: number[]; // 0-6, where 0 is Sunday
  };
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: string; // ISO date string
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface TechnicianSchedule {
  id: string;
  technicianId: string;
  bookingId: string;
  status: 'PENDING' | 'EN_ROUTE' | 'ON_SITE' | 'COMPLETED' | 'CANCELLED';
  scheduledStartTime: string; // ISO date string
  scheduledEndTime: string; // ISO date string
  actualStartTime?: string; // ISO date string
  actualEndTime?: string; // ISO date string
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
