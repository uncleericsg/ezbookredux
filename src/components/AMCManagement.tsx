import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AMCStatusCard from './AMCStatusCard';
import ServiceVisitTimeline from './ServiceVisitTimeline';
import AMCRenewalModal from './AMCRenewalModal';
import { useAMCStatus } from '../hooks/useAMCStatus';
import { useUserRedux } from '../contexts/UserContext';
import { useToast } from '../hooks/useToast';

const AMCManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserRedux();
  const {
    visits,
    loading,
    completedVisits,
    totalVisits,
    visitsRemaining,
  } = useAMCStatus();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const toast = useToast();

  if (!user) return null;
  
  // Check if user has AMC access
  if (!user.lastName.toLowerCase().includes('amc')) {
    navigate('/', { replace: true });
    toast.showError('Access denied');
    return null;
  }

  const handleScheduleService = () => {
    if (visitsRemaining <= 0) {
      toast.showWarning('Please renew your AMC package to schedule more services');
      return;
    }
    
    navigate('/schedule', {
      state: {
        categoryId: 'amc-service',
        isAmcService: true,
      },
    });
  };

  const handleRenewalSuccess = () => {
    setShowRenewalModal(false);
    toast.showSuccess('AMC package renewed successfully');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AMC Management</h1>

      <AMCStatusCard
        user={user}
        visitsCompleted={completedVisits}
        totalVisits={totalVisits}
        onSchedule={handleScheduleService}
      />

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Service History</h2>
        <ServiceVisitTimeline visits={visits} loading={loading} />
      </div>

      {user.amcStatus === 'expired' && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">AMC Package Expired</h3>
          <p className="text-gray-400 mb-4">
            Your AMC package has expired. Renew now to continue enjoying premium benefits.
          </p>
          <button
            onClick={() => setShowRenewalModal(true)}
            className="btn btn-primary"
          >
            Renew AMC Package
          </button>
        </div>
      )}

      <AMCRenewalModal
        isOpen={showRenewalModal}
        onClose={() => setShowRenewalModal(false)}
        onSuccess={handleRenewalSuccess}
      />
    </div>
  );
};

export default AMCManagement;