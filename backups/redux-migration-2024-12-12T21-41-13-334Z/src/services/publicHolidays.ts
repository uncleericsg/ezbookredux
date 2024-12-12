import axios from 'axios';
import { addDays, startOfDay, format } from 'date-fns';

import type { Holiday } from '../types';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const fetchPublicHolidays = async (year: number): Promise<Holiday[]> => {
  if (import.meta.env.DEV) {
    // Only include remaining 2024 holidays and 2025 holidays
    const currentDate = new Date();
    const holidays = [];
    
    // 2024 holidays (only include upcoming ones)
    if (year === 2024) {
      const remainingHolidays = [
        { id: '2024-03-29', date: '2024-03-29', holiday: 'Good Friday', dayOfWeek: 'Friday' },
        { id: '2024-04-10', date: '2024-04-10', holiday: 'Hari Raya Puasa', dayOfWeek: 'Wednesday' },
        { id: '2024-05-01', date: '2024-05-01', holiday: 'Labour Day', dayOfWeek: 'Wednesday' },
        { id: '2024-05-22', date: '2024-05-22', holiday: 'Vesak Day', dayOfWeek: 'Wednesday' },
        { id: '2024-06-17', date: '2024-06-17', holiday: 'Hari Raya Haji', dayOfWeek: 'Monday' },
        { id: '2024-08-09', date: '2024-08-09', holiday: 'National Day', dayOfWeek: 'Friday' },
        { id: '2024-11-02', date: '2024-11-02', holiday: 'Deepavali', dayOfWeek: 'Saturday' },
        { id: '2024-12-25', date: '2024-12-25', holiday: 'Christmas Day', dayOfWeek: 'Wednesday' }
      ];
      
      holidays.push(...remainingHolidays.filter(holiday => 
        new Date(holiday.date) > currentDate
      ));
    }
    
    // 2025 holidays
    if (year === 2025) {
      holidays.push(
        { id: '2025-01-01', date: '2025-01-01', holiday: "New Year's Day", dayOfWeek: 'Wednesday' },
        { id: '2025-01-29', date: '2025-01-29', holiday: 'Chinese New Year', dayOfWeek: 'Wednesday' },
        { id: '2025-01-30', date: '2025-01-30', holiday: 'Chinese New Year', dayOfWeek: 'Thursday' },
        { id: '2025-04-18', date: '2025-04-18', holiday: 'Good Friday', dayOfWeek: 'Friday' },
        { id: '2025-05-01', date: '2025-05-01', holiday: 'Labour Day', dayOfWeek: 'Thursday' },
        { id: '2025-05-11', date: '2025-05-11', holiday: 'Hari Raya Puasa', dayOfWeek: 'Sunday' },
        { id: '2025-05-12', date: '2025-05-12', holiday: 'Vesak Day', dayOfWeek: 'Monday' },
        { id: '2025-07-07', date: '2025-07-07', holiday: 'Hari Raya Haji', dayOfWeek: 'Monday' },
        { id: '2025-08-09', date: '2025-08-09', holiday: 'National Day', dayOfWeek: 'Saturday' },
        { id: '2025-10-22', date: '2025-10-22', holiday: 'Deepavali', dayOfWeek: 'Wednesday' },
        { id: '2025-12-25', date: '2025-12-25', holiday: 'Christmas Day', dayOfWeek: 'Thursday' }
      );
    }
    
    // Filter out past holidays
    const today = startOfDay(new Date());
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today;
    });
  }

  try {
    const response = await axios.get(
      `https://api.data.gov.sg/v1/holidays/${year}`,
      {
        headers: {
          'api-key': import.meta.env.VITE_DATA_GOV_SG_API_KEY,
        },
      }
    );
    
    const holidays = response.data.items.map((item: any) => ({
      id: item.date,
      date: item.date,
      holiday: item.name,
      dayOfWeek: DAYS_OF_WEEK[new Date(item.date).getDay()]
    }));
    
    // Filter out past holidays
    const today = startOfDay(new Date());
    return holidays.filter(holiday => {
      const holidayDate = new Date(holiday.date);
      return holidayDate >= today;
    });
  } catch (error) {
    console.error('Failed to fetch public holidays:', error);
    return [];
  }
};

export const updatePublicHolidays = async (): Promise<void> => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  try {
    const [currentYearHolidays, nextYearHolidays] = await Promise.all([
      fetchPublicHolidays(currentYear),
      fetchPublicHolidays(nextYear),
    ]);

    const holidays = [...currentYearHolidays, ...nextYearHolidays]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Store in localStorage for offline access
    localStorage.setItem('publicHolidays', JSON.stringify(Array.from(holidays)));

    return holidays;
  } catch (error) {
    console.error('Failed to update public holidays:', error);
    throw error;
  }
};