import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import type { AcuitySettings } from '../types/settings';

interface TestResults {
  success: number;
  failed: number;
  errors: string[];
  lastSync?: string;
}

export const useAcuityTesting = (settings: AcuitySettings) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TestResults>({
    success: 0,
    failed: 0,
    errors: []
  });

  const testConnection = useCallback(async () => {
    if (!settings.apiKey || !settings.userId) {
      toast.error('API key and User ID are required');
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/acuity/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: settings.apiKey,
          userId: settings.userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Acuity');
      }

      const data = await response.json();
      setResults(prev => ({
        ...prev,
        success: prev.success + 1,
        lastSync: new Date().toISOString()
      }));

      toast.success('Acuity connection successful');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection test failed';
      setResults(prev => ({
        ...prev,
        failed: prev.failed + 1,
        errors: [...prev.errors, message]
      }));
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const testBookingFlow = useCallback(async () => {
    try {
      setLoading(true);
      
      // Test appointment creation
      const appointment = await fetch('/api/acuity/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          datetime: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
          appointmentTypeID: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com'
        })
      });

      if (!appointment.ok) {
        throw new Error('Failed to create test appointment');
      }

      // Test appointment retrieval
      const { id } = await appointment.json();
      const verification = await fetch(`/api/acuity/appointments/${id}`);
      
      if (!verification.ok) {
        throw new Error('Failed to verify appointment');
      }

      setResults(prev => ({
        ...prev,
        success: prev.success + 1
      }));

      toast.success('Booking flow test successful');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Booking flow test failed';
      setResults(prev => ({
        ...prev,
        failed: prev.failed + 1,
        errors: [...prev.errors, message]
      }));
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const testWebhooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/acuity/webhooks/test', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Webhook test failed');
      }

      setResults(prev => ({
        ...prev,
        success: prev.success + 1
      }));

      toast.success('Webhook test successful');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Webhook test failed';
      setResults(prev => ({
        ...prev,
        failed: prev.failed + 1,
        errors: [...prev.errors, message]
      }));
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults({
      success: 0,
      failed: 0,
      errors: []
    });
  }, []);

  return {
    loading,
    results,
    testConnection,
    testBookingFlow,
    testWebhooks,
    clearResults
  };
};