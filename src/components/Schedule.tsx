import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@store';
import { useAppointments } from '@hooks/useAppointments';
import ServiceScheduling from '@components/ServiceScheduling';
import ServiceReminder from '@components/ServiceReminder';

const Schedule: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.currentUser);

  const handleSchedule = () => {
    document.getElementById('scheduling-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">      
      {user?.nextServiceDate && (
        <ServiceReminder
          nextServiceDate={user.nextServiceDate}
          onSchedule={handleSchedule}
          isAMC={user.lastName.toLowerCase().includes('amc')}
        />
      )}
      
      <div id="scheduling-form">
        <ServiceScheduling />
      </div>
    </div>
  );
};

export default Schedule;