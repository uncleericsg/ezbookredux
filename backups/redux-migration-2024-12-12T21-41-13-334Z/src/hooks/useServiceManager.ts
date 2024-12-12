import { useState, useEffect } from 'react';
import { ServiceManager, ServiceInitOptions } from '../services/serviceManager';

export const useServiceManager = (options: ServiceInitOptions = {}) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const serviceManager = ServiceManager.getInstance();

  useEffect(() => {
    const initializeServices = async () => {
      try {
        await serviceManager.initializeServices(options);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsInitializing(false);
      }
    };

    initializeServices();
  }, []);

  const reinitializeService = async (serviceName: string) => {
    setIsInitializing(true);
    try {
      await serviceManager.reinitializeService(serviceName);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsInitializing(false);
    }
  };

  return {
    isInitializing,
    error,
    isFeatureEnabled: (feature: string) => serviceManager.isFeatureEnabled(feature),
    isServiceInitialized: (service: string) => serviceManager.isServiceInitialized(service),
    reinitializeService,
  };
};
