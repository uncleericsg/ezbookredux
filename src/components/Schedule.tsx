import React from 'react';
import ServiceScheduling from './ServiceScheduling';
import ServiceReminder from './ServiceReminder';
import { useUser } from '../contexts/UserContext';

const Schedule: React.FC = () => {
  const { user } = useUser();

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