import { useState, useCallback } from 'react';
import { testConnection, syncCustomerData, syncInventoryData, processPayment } from '../services/repairShopr';
import { toast } from 'sonner';

export const useRepairShopr = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);

  const verifyConnection = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const isConnected = await testConnection();
      setConnectionStatus(isConnected);
      
      if (isConnected) {
        toast.success('RepairShopr connection verified');
      } else {
        toast.error('RepairShopr connection failed');
      }
      
      return isConnected;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify RepairShopr connection';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const syncData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [customerSync, inventorySync] = await Promise.all([
        syncCustomerData(userId),
        syncInventoryData()
      ]);

      if (customerSync && inventorySync) {
        toast.success('Data synchronization complete');
        return true;
      } else {
        throw new Error('Data synchronization failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync data';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePayment = useCallback(async (ticketId: string, amount: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const success = await processPayment(ticketId, amount);
      
      if (success) {
        toast.success('Payment processed successfully');
        return true;
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process payment';
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    connectionStatus,
    verifyConnection,
    syncData,
    handlePayment
  };
};