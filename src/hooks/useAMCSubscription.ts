import { useState, useCallback } from 'react';
import { useUserRedux } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAMCSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateProfile } = useUserRedux();
  const navigate = useNavigate();

  const activateAMC = useCallback(async () => {
    if (!user) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Update user status
      await updateProfile({
        ...user,
        amcStatus: 'active'
      });

      // Show success message
      toast.success('AMC Package activated successfully!');
      
      // Redirect to scheduling
      navigate('/schedule', { 
        state: { 
          isAMC: true,
          categoryId: 'amc-service'
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to activate AMC package';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user, updateProfile, navigate]);

  const handlePaymentSuccess = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Process successful payment
      await activateAMC();

      // Send confirmation email
      await fetch('/api/notifications/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.id,
          type: 'amc_activation'
        })
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment processing failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user, activateAMC]);

  return {
    loading,
    error,
    activateAMC,
    handlePaymentSuccess
  };
};

export default useAMCSubscription;