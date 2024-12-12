import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
}

export const useCalendarExport = () => {
  const generateICS = (event: CalendarEvent): string => {
    const formatDate = (date: string) => {
      return format(new Date(date), "yyyyMMdd'T'HHmmss'Z'");
    };

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//iAircon//Easy Booking//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(event.startTime)}`,
      `DTEND:${formatDate(event.endTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return ics;
  };

  const downloadCalendarFile = (event: CalendarEvent) => {
    const icsContent = generateICS(event);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'service-appointment.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { downloadCalendarFile };
};