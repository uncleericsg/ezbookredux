// @ai-visual-protection: This component's visual design and styling must be preserved exactly as is.
// @ai-visual-protection: Any modifications should only affect functionality, not appearance.
// @ai-protection: This calendar component is critical for the booking flow and has been carefully designed to handle:
// 1. Public holidays (marked in red with tooltips)
// 2. Date selection constraints (past dates, min/max dates)
// 3. Disabled dates based on business rules
// 4. Visual indicators for today's date and selected date
// DO NOT modify the core logic or styling without thorough testing

import React, { useState, useCallback, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePublicHolidays } from '../hooks/usePublicHolidays';

// @ai-protection: These props are essential for the calendar's functionality
// DO NOT remove or modify existing props without updating all consuming components
interface CalendarProps {
  mode?: 'single' | 'range';  // @ai-note: Currently only 'single' mode is implemented
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  disabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// @ai-protection: This component implements a custom calendar with holiday awareness
// It is used in the booking flow to ensure users can only select valid dates
const Calendar: React.FC<CalendarProps> = ({
  mode = 'single',
  selected,
  onSelect,
  disabled,
  minDate = new Date(),
  maxDate,
  className = ''
}) => {
  // @ai-protection: State management for current month view
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { holidays } = usePublicHolidays();

  // @ai-protection: Calculate calendar days and starting position
  const { days, startDay } = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const firstDayOfMonth = start.getDay();

    return {
      days: eachDayOfInterval({ start, end }),
      startDay: firstDayOfMonth
    };
  }, [currentMonth]);

  // @ai-protection: Core logic for determining if a date can be selected
  // This includes checks for holidays, disabled dates, and date range constraints
  const isDateSelectable = useCallback((date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check basic constraints
    if (date < today) return false;
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    
    // Check disabled dates
    if (disabled && disabled(date)) return false;
    
    // Check holidays - using Set.has() instead of Array.some()
    const dateString = format(date, 'yyyy-MM-dd');
    if (holidays.has(dateString)) {
      return false;
    }
    
    return true;
  }, [disabled, minDate, maxDate, holidays]);

  // @ai-protection: Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // @ai-visual-protection: The following JSX structure and styling must be preserved
  return (
    <div className={`p-4 bg-gray-800 rounded-xl shadow-xl ${className}`}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for alignment */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}
        
        {/* Date cells */}
        {days.map(date => {
          const isSelected = selected ? isSameDay(selected, date) : false;
          const selectable = isDateSelectable(date);
          const dateString = format(date, 'yyyy-MM-dd');
          const isHoliday = holidays.has(dateString);

          return (
            <button
              key={date.toISOString()}
              onClick={() => selectable && onSelect(date)}
              disabled={!selectable}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium
                transition-colors relative
                ${isSelected
                  ? 'bg-blue-600 text-white'
                  : selectable
                    ? 'hover:bg-gray-700 text-white'
                    : 'text-gray-500 cursor-not-allowed'
                }
                ${isToday(date) ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''}
                ${isHoliday ? 'bg-red-900/50' : ''}
              `}
              title={isHoliday ? 'Public Holiday' : undefined}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// @ai-protection: This calendar component is essential for the booking system
// Any changes must be thoroughly tested to ensure they don't break the booking flow
export { Calendar };