import { useState, useEffect } from 'react';
import type { SocialLinks } from '@types';
import { fetchSocialLinks } from '@services/social';

export const useSocialLinks = () => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const links = await fetchSocialLinks();
        setSocialLinks(links);
      } catch (error) {
        console.error('Failed to fetch social links:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSocialLinks();
  }, []);

  return { socialLinks, loading };
};