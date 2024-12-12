import { useState } from 'react';
import { scheduleCustomMessage } from '../services/notifications';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface MessageSchedule {
  content: string;
  url?: string;
  scheduledDate: string;
  scheduledTime: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  userType: 'all' | 'amc' | 'regular';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface MessageStats {
  opens: number;
  clicks: number;
  engagement: number;
}

export const useCustomMessages = () => {
  const [loading, setLoading] = useState(false);

  const { data: messageStats } = useQuery<MessageStats>({
    queryKey: ['messageStats'],
    queryFn: async () => {
      // In development, return mock stats
      if (import.meta.env.DEV) {
        return {
          opens: 245,
          clicks: 89,
          engagement: 0.36
        };
      }
      const response = await fetch('/api/messages/stats');
      return response.json();
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  const scheduleMessage = async (schedule: MessageSchedule) => {
    setLoading(true);
    try {
      await scheduleCustomMessage(schedule);
      toast.success('Message scheduled successfully');
    } catch (error) {
      console.error('Failed to schedule message:', error);
      toast.error('Failed to schedule message');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    scheduleMessage,
    loading,
    messageStats,
    hasStats: !!messageStats
  };
};