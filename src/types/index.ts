import { useState, useEffect } from 'react';
import { fetchPublicHolidays, updatePublicHolidays } from '../services/publicHolidays';
import { addDays, startOfDay, format } from 'date-fns';

interface Holiday {
  id: string;
  date: string;
  holiday: string;
  dayOfWeek: string;
}

export type { Holiday };

export interface HolidayGreeting {
  id: string;
  holiday: string;
  date: string;
  dayOfWeek?: string;
  message: string;
  enabled: boolean;
  sendTime: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface PaymentIntent {
  readonly id: string;
  readonly clientSecret: string;
  readonly amount: number;
  readonly status: string;
}

export interface PaymentMethod {
  readonly id: string;
  readonly type: string;
  readonly card?: {
    readonly brand: string;
    readonly last4: string;
    readonly expMonth: number;
    readonly expYear: number;
  };
}

// Lock payment flow configuration
export const PAYMENT_CONFIG = Object.freeze({
  ALLOWED_CARD_NETWORKS: ['visa', 'mastercard', 'amex'],
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000,
  CURRENCY: 'sgd',
  COUNTRY: 'SG'
});

// Lock validation rules
export const VALIDATION_RULES = Object.freeze({
  REQUIRED_FIELDS: ['email', 'firstName', 'lastName', 'phone'],
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[89]\d{7}$/,
  POSTAL_CODE_PATTERN: /^\d{6}$/
});

export const usePublicHolidays = () => {
  const [holidays, setHolidays] = useState<Map<string, Holiday>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const storedHolidays = localStorage.getItem('publicHolidays');
        
        // Fetch holidays for current and next year
        const [currentYearHolidays, nextYearHolidays] = await Promise.all([
          fetchPublicHolidays(currentYear),
          fetchPublicHolidays(currentYear + 1)
        ]);

        // Combine and sort holidays
        const allHolidays = [...currentYearHolidays, ...nextYearHolidays]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Filter to next 365 days
        const today = startOfDay(new Date());
        const yearFromNow = addDays(today, 365);
        
        const upcomingHolidays = allHolidays.filter(holiday => {
          const holidayDate = new Date(holiday.date);
          return holidayDate >= today && holidayDate <= yearFromNow;
        });

        // Convert to Map for O(1) lookup
        const holidayMap = new Map<string, Holiday>();
        upcomingHolidays.forEach(holiday => {
          holidayMap.set(format(new Date(holiday.date), 'yyyy-MM-dd'), holiday);
        });

        setHolidays(holidayMap);

        // Update stored holidays if needed
        if (currentMonth === 9 || !storedHolidays) {
          localStorage.setItem('publicHolidays', JSON.stringify(Array.from(holidayMap.entries())));
        }
      } catch (err) {
        setError('Failed to load public holidays');
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
    
    // Update daily
    const dailyUpdate = setInterval(loadHolidays, 24 * 60 * 60 * 1000);
    return () => clearInterval(dailyUpdate);
  }, []);

  return { holidays, loading, error };
};

export interface User {
  id: string;
  phone: string;
  role: 'admin' | 'regular' | 'tech';
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  bookings: any[];
  notifications: any[];
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
}