import axios from 'axios';
import { toast } from 'sonner';

export interface AcuityAppointmentType {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  description?: string;
  active: boolean;
  maxCapacity: number;
  minInterval: number;
}

export interface AcuitySettings {
  apiKey: string;
  userId: string;
  enabled: boolean;
  defaultIntervalWeeks: number;
  appointmentTypes: AcuityAppointmentType[];
  businessHours: {
    [key: string]: {
      start: string;
      end: string;
    };
  };
  bufferTime: number;
  maxAdvanceBookingDays: number;
}

export const fetchAcuitySettings = async (): Promise<AcuitySettings> => {
  try {
    const response = await axios.get('/api/settings/acuity', {
      headers: {
        'X-Acuity-API-Key': import.meta.env.VITE_ACUITY_API_KEY,
        'X-Acuity-User-ID': import.meta.env.VITE_ACUITY_USER_ID
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Acuity settings:', error);
    throw error;
  }
};

export const syncAppointmentTypes = async (): Promise<void> => {
  try {
    const response = await axios.post('/api/acuity/sync-types', null, {
      headers: {
        'X-Acuity-API-Key': import.meta.env.VITE_ACUITY_API_KEY,
        'X-Acuity-User-ID': import.meta.env.VITE_ACUITY_USER_ID
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to sync appointment types:', error);
    throw error;
  }
};

export const validateAcuityCredentials = async (): Promise<boolean> => {
  try {
    const response = await axios.post('/api/acuity/validate-credentials', null, {
      headers: {
        'X-Acuity-API-Key': import.meta.env.VITE_ACUITY_API_KEY,
        'X-Acuity-User-ID': import.meta.env.VITE_ACUITY_USER_ID
      }
    });
    return response.data.valid;
  } catch (error) {
    console.error('Failed to validate Acuity credentials:', error);
    return false;
  }
};

export const fetchAppointmentTypes = async (): Promise<AcuityAppointmentType[]> => {
  if (import.meta.env.DEV) {
    // Return mock data for development
    return [
      {
        id: 1,
        name: 'Regular Maintenance',
        duration: 60,
        price: 80,
        category: 'maintenance',
        description: 'Standard air conditioning maintenance service',
        active: true,
        maxCapacity: 6,
        minInterval: 60
      },
      {
        id: 2,
        name: 'AMC Service Visit',
        duration: 90,
        price: 0,
        category: 'amc',
        description: 'Scheduled maintenance under AMC package',
        active: true,
        maxCapacity: 5,
        minInterval: 90
      },
      {
        id: 3,
        name: 'Repair Service',
        duration: 120,
        price: 120,
        category: 'repair',
        description: 'Diagnostic and repair service',
        active: true,
        maxCapacity: 4,
        minInterval: 120
      }
    ];
  }

  try {
    const response = await axios.get('/api/acuity/appointment-types');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch appointment types:', error);
    throw error;
  }
};

export const validateAppointmentType = (
  appointmentType: AcuityAppointmentType,
  isAMC: boolean
): boolean => {
  if (!appointmentType.active) {
    toast.error('This service type is currently unavailable');
    return false;
  }

  if (isAMC && appointmentType.category !== 'amc') {
    toast.error('Invalid service type for AMC booking');
    return false;
  }

  return true;
};