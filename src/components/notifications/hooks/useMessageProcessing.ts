import { useMemo } from 'react';
import { PreviewData } from '../types/messageTypes';

export const useProcessedMessage = (content: string | undefined, previewData: Partial<PreviewData>) => {
  const previewDataEntries = useMemo(() => Object.entries(previewData), [previewData]);

  return useMemo(() => {
    if (!content) return '';
    let processedContent = content;
    
    previewDataEntries.forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      processedContent = processedContent.replace(regex, value || `{${key}}`);
    });

    return processedContent;
  }, [content, previewDataEntries]);
};

export const useCharacterCount = (content: string) => {
  return useMemo(() => {
    return {
      total: content.length,
      withoutSpaces: content.replace(/\s/g, '').length,
      words: content.trim().split(/\s+/).length
    };
  }, [content]);
};

export const useUrlWithUtm = (url: string | undefined, utmParams: Record<string, string | undefined>) => {
  return useMemo(() => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      Object.entries(utmParams).forEach(([key, value]) => {
        if (value) urlObj.searchParams.append(key, value);
      });
      return urlObj.toString();
    } catch {
      return url;
    }
  }, [url, utmParams]);
};
