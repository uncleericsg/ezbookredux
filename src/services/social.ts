import type { SocialLinks } from '@types';

export const fetchSocialLinks = async (): Promise<SocialLinks> => {
  // In a real app, this would fetch from an API
  return {
    facebook: 'https://facebook.com/iaircon',
    instagram: 'https://instagram.com/iaircon',
    youtube: 'https://youtube.com/@iaircon',
    tiktok: 'https://tiktok.com/@iaircon',
  };
};