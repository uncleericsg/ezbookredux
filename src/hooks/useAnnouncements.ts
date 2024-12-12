import { useState, useEffect } from 'react';
import type { Announcement } from '../types';
import { fetchAnnouncements } from '../services/announcements';

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        const now = new Date();
        const activeAnnouncements = data.filter(announcement => {
          const start = new Date(announcement.startDate);
          const end = new Date(announcement.endDate);
          return now >= start && now <= end;
        });
        setAnnouncements(activeAnnouncements);
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  return { announcements, loading, dismissAnnouncement };
};