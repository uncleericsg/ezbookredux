import { useState } from 'react';
import { submitServiceRating } from '../services/ratings';
import { chatGPTService } from '../services/chatgpt';
import { useAcuitySettings } from './useAcuitySettings';
import { toast } from 'sonner';

export const useServiceRating = () => {
  const [loading, setLoading] = useState(false);
  const { settings } = useAcuitySettings();

  const submitRating = async (serviceId: string, rating: number, feedback?: string) => {
    setLoading(true);
    try {
      await submitServiceRating(serviceId, rating, feedback);
      
      // Generate response using ChatGPT if enabled and rating is 4-5 stars
      if (settings?.chatGPTSettings?.enabled && rating >= 4 && feedback) {
        const response = await chatGPTService.generateRatingResponse(
          rating,
          feedback,
          settings.chatGPTSettings
        );
        toast.success(response);
      }
      
      toast.success('Thank you for your feedback!');
    } catch (error) {
      console.error('Failed to submit rating:', error);
      toast.error('Failed to submit rating');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitRating,
    loading
  };
};