/**
 * Appointment types
 */

/**
 * Appointment status
 */
export type AppointmentStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

/**
 * Appointment type
 */
export interface AppointmentType {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Display name
   */
  name: string;

  /**
   * Description
   */
  description: string;

  /**
   * Duration in minutes
   */
  duration: number;

  /**
   * Base price
   */
  price: number;

  /**
   * Color for calendar display
   */
  color?: string;

  /**
   * Icon name
   */
  icon?: string;

  /**
   * Whether type is active
   */
  active: boolean;

  /**
   * Display order
   */
  order: number;

  /**
   * Service category ID
   */
  serviceCategoryId?: string;
}

/**
 * Default appointment types
 */
export const defaultAppointmentTypes: AppointmentType[] = [
  {
    id: 'regular-service',
    name: 'Regular Service',
    description: 'Standard air conditioning maintenance service',
    duration: 60,
    price: 80,
    color: '#4CAF50',
    icon: 'AirVent',
    active: true,
    order: 1
  },
  {
    id: 'repair-service',
    name: 'Repair Service',
    description: 'Diagnostic and repair service for AC issues',
    duration: 120,
    price: 120,
    color: '#F44336',
    icon: 'Wrench',
    active: true,
    order: 2
  },
  {
    id: 'amc-service',
    name: 'AMC Service Visit',
    description: 'Scheduled maintenance under AMC package',
    duration: 90,
    price: 0,
    color: '#2196F3',
    icon: 'ShieldCheck',
    active: true,
    order: 3
  },
  {
    id: 'installation',
    name: 'New Installation',
    description: 'Installation of new air conditioning unit',
    duration: 240,
    price: 300,
    color: '#9C27B0',
    icon: 'Plus',
    active: true,
    order: 4
  },
  {
    id: 'emergency',
    name: 'Emergency Service',
    description: 'Urgent repair service for critical issues',
    duration: 120,
    price: 200,
    color: '#FF5722',
    icon: 'AlertTriangle',
    active: true,
    order: 5
  }
];
