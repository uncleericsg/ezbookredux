export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
}

export interface HolidayState {
  holidays: Holiday[];
  loading: boolean;
  error: Error | null;
  selectedHoliday: Holiday | null;
  currentPage: number;
  previewMessage: string;
  showConfirmation: boolean;
}

export type HolidayAction =
  | { type: 'SET_HOLIDAYS'; payload: Holiday[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_SELECTED_HOLIDAY'; payload: Holiday | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PREVIEW'; payload: string }
  | { type: 'SET_CONFIRMATION'; payload: boolean }
  | { type: 'CLEAR_STATE' };

export interface HolidayListProps {
  className?: string;
}

export interface HolidayItemProps {
  holiday: Holiday;
  onSchedule: (holiday: Holiday) => void;
  style: React.CSSProperties;
}
