import { useState } from 'react';
import { submitServiceRating } from '@services/ratings';
import { chatGPTService } from '@services/chatgpt';
import { useSettingsForm } from '@hooks/useSettingsForm';
import { toast } from 'sonner';
import type { AppSettings, ChatGPTSettings } from '../types/appSettings';
import { defaultAppSettings } from '../types/appSettings';

export const useServiceRating = () => {
  const [loading, setLoading] = useState(false);
  const { settings } = useSettingsForm<AppSettings>(
    defaultAppSettings,
    async (settings) => {
      // Settings update not needed in this hook
    },
    async () => defaultAppSettings
  );

  const submitRating = async (serviceId: string, rating: number, feedback?: string) => {
    setLoading(true);
    try {
      await submitServiceRating(serviceId, rating, feedback);
      
      // Generate response using ChatGPT if enabled and rating is 4-5 stars
      if (settings?.chatGPTSettings?.enabled && rating >= 4 && feedback) {
        const chatGPTSettings: ChatGPTSettings = {
          apiKey: settings.chatGPTSettings.apiKey,
          model: settings.chatGPTSettings.model,
          enabled: settings.chatGPTSettings.enabled,
          maxTokens: settings.chatGPTSettings.maxTokens,
          temperature: settings.chatGPTSettings.temperature
        };

        const response = await chatGPTService.generateRatingResponse(
          rating,
          feedback,
          chatGPTSettings
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