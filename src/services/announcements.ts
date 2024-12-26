import type { Announcement } from '@types';

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  // In a real app, this would fetch from an API
  return [
    {
      id: '1',
      title: 'Special Holiday Offer',
      message: 'Get 20% off on AMC renewals this holiday season! Limited time offer.',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
    },
    {
      id: '2',
      title: 'New Mobile App Features',
      message: 'We\'ve added new features to help you manage your AMC better. Check them out!',
      startDate: '2024-03-15',
      endDate: '2024-04-15',
    },
  ];
};