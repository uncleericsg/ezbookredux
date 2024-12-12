import React from 'react';
import { format, isToday, isSameDay, addMonths, subMonths, startOfMonth, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { usePublicHolidays } from '../hooks/usePublicHolidays';
import type { Holiday } from '../types';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  suggestedDate?: Date | null;
  blockedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

const ServiceSchedulingCalendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
  suggestedDate,
  blockedDates = [],
  minDate = new Date(),
  maxDate,
  className = ''
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const { holidays } = usePublicHolidays();

  const daysInMonth = Array.from(
    { length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
    (_, i) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
  );

  const startDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const endDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();

  const prevDays = Array.from({ length: startDay }, (_, i) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -i)
  ).reverse();

  const nextDays = Array.from({ length: 6 - endDay }, (_, i) =>
    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i + 1)
  );

  const isDateSelectable = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isBlocked = blockedDates.some(blockedDate => isSameDay(date, blockedDate));
    const dateStr = format(date, 'yyyy-MM-dd');
    const isHoliday = holidays.has(dateStr);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isTooEarly = minDate && date < minDate;
    const isTooLate = maxDate && date > maxDate;
    const isTooFarInFuture = new Date(date) > addMonths(today, 3);

    return !isBlocked && !isHoliday && !isWeekend && !isTooEarly && !isTooLate && date >= today && !isTooFarInFuture;
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newMonth >= startOfMonth(today)) {
      setCurrentMonth(newMonth);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => prevMonth()}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={format(currentMonth, 'M') === format(new Date(), 'M')}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => nextMonth()}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={`empty-start-${index}`} className="p-2" />
        ))}

        {[...prevDays, ...daysInMonth, ...nextDays].map((date, index) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isSuggested = suggestedDate && isSameDay(date, suggestedDate);
          const isSelectable = isDateSelectable(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          return (
            <button
              key={index}
              onClick={() => isSelectable && onDateSelect(date)}
              disabled={!isSelectable}
              className={`
                p-2 rounded-lg text-center relative
                ${isSelected ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800' : ''}
                ${!isCurrentMonth ? 'text-gray-600' : ''}
                ${isSelectable ? 'hover:bg-gray-700 hover:border-gray-600 transition-all duration-200' : 'cursor-not-allowed opacity-50'}
                ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                ${isSuggested ? 'ring-2 ring-green-500' : ''}
                text-base font-medium
              `}
            >
              {format(date, 'd')}
              {isSuggested && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-400 border-t border-gray-700 pt-4">
        <div className="flex items-center space-x-4 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full ring-2 ring-blue-500/20"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full ring-2 ring-green-500/20"></div>
            <span>Suggested</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full ring-2 ring-gray-500/20"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSchedulingCalendar;