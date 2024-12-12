import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchAnalytics } from '../services/admin';
import { tabs } from '../components/admin/AdminNav';

export const useAdminDashboard = () => {
  // Set initial tab to 0 (Services) instead of Users
  const [activeTab, setActiveTab] = useState<number>(0);
  const queryClient = useQueryClient();

  const handleTabChange = (tab: number) => {
    setActiveTab(tab);
    // Prefetch data for the selected tab
    queryClient.prefetchQuery({
      queryKey: ['admin', tabs[tab] ? tabs[tab].id : ''],
      staleTime: 5 * 60 * 1000, // 5 minutes
      queryFn: () => {
        switch (tab) {
          case 5: // Analytics tab (index changed due to reordering)
            return fetchAnalytics();
          default:
            return Promise.resolve(null);
        }
      }
    });
  };

  return {
    activeTab,
    setActiveTab: handleTabChange
  };
};