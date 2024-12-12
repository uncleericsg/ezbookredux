import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from './useAppointments';
import { useToast } from './useToast';
import { useCalendarExport } from './useCalendarExport';
import { useUser } from '../contexts/UserContext';
import { addDays } from 'date-fns';

export const useServiceScheduling = (categoryId: string, isAMC: boolean = false) => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
  const { bookNewAppointment } = useAppointments();
  const { downloadCalendarFile } = useCalendarExport();
  const { user } = useUser();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSchedule = async (date: Date, time: string) => {
    try {
      setLoading(true);
      const appointmentId = await bookNewAppointment(time, categoryId);
      
      // Calculate next service date for AMC customers
      let nextServiceDate = null;
      if (isAMC) {
        nextServiceDate = addDays(date, 75); // Default 75-day interval for AMC
      }
      
      const details = {
        date,
        time,
        appointmentId,
        visitNumber: isAMC ? calculateVisitNumber() : undefined,
        nextServiceDate,
      };

      setAppointmentDetails(details);
      setConfirmed(true);
      toast.showSuccess('Service scheduled successfully');
    } catch (error) {
      toast.showError('Failed to schedule service');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!appointmentDetails || !user) return;

    const event = {
      title: isAMC ? `AMC Service Visit #${appointmentDetails.visitNumber}` : 'Air Conditioning Service',
      description: `Service appointment with iAircon${isAMC ? ` (Visit #${appointmentDetails.visitNumber})` : ''}`,
      startTime: new Date(`${appointmentDetails.date}T${appointmentDetails.time}`).toISOString(),
      endTime: new Date(`${appointmentDetails.date}T${appointmentDetails.time}`).toISOString(),
      location: user.address || 'Your Registered Address',
    };

    downloadCalendarFile(event);
    toast.showSuccess('Calendar event downloaded');
  };

  const calculateVisitNumber = () => {
    // This would normally come from the backend
    return 1;
  };

  return {
    loading,
    confirmed,
    appointmentDetails,
    handleSchedule,
    handleAddToCalendar,
  };
};