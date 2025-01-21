import React, { useState, useMemo, useCallback } from 'react';
import { Copy, AlertCircle, Smartphone, Monitor, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@hooks/useToast';
import type { Template } from './types/templateTypes';
import { PreviewData } from './types/messageTypes';
import { TEST_IDS } from './constants/templateConstants';
import { PreviewAdapter } from './adapters/previewAdapter';
import { ValidationAdapter } from './adapters/validationAdapter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toast } from '@/components/ui/toast';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplatePreviewProps {
  template: Template;
  sampleData?: PreviewData;
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const previewAdapter = new PreviewAdapter();
const validationAdapter = new ValidationAdapter();

const NotificationTemplatePreview: React.FC<TemplatePreviewProps> = ({
  template,
  sampleData = {},
  children,
  className = '',
  isLoading = false,
}) => {
  const { toast } = useToast();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isCopied, setIsCopied] = useState(false);

  // Create preview configuration
  const previewConfig = useMemo(() => {
    return previewAdapter.createPreviewConfig(template, previewMode, sampleData);
  }, [template, previewMode, sampleData]);

  // Process message with preview data
  const processedMessage = useMemo(() => {
    return previewAdapter.processMessage(template.content, previewConfig);
  }, [template.content, previewConfig]);

  // Get character count
  const characterCount = useMemo(() => {
    return previewAdapter.getCharacterCount(processedMessage);
  }, [processedMessage]);

  // Get validation errors
  const validationErrors = useMemo(() => {
    return validationAdapter.validate(template, previewConfig);
  }, [template, previewConfig]);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(processedMessage);
      setIsCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  }, [processedMessage, toast]);

  if (isLoading) {
    return (
      <Card 
        className="w-full animate-pulse"
        data-testid={TEST_IDS.previewSkeleton}
      >
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-1/4" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Preview</h3>
            <Badge variant={validationErrors.length > 0 ? 'destructive' : 'default'}>
              {characterCount} characters
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewMode('desktop')}
              className={previewMode === 'desktop' ? 'bg-gray-100' : ''}
              data-testid={TEST_IDS.desktopPreviewButton}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewMode('mobile')}
              className={previewMode === 'mobile' ? 'bg-gray-100' : ''}
              data-testid={TEST_IDS.mobilePreviewButton}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={validationErrors.length > 0}
              className="gap-2"
              data-testid={TEST_IDS.copyButton}
            >
              {isCopied ? (
                <><Check className="h-4 w-4" />Copied</>
              ) : (
                <><Copy className="h-4 w-4" />Copy</>
              )}
            </Button>
          </div>
        </div>

        <motion.div
          className={`rounded-lg p-4 ${
            previewMode === 'mobile' ? 'max-w-sm mx-auto border-2' : ''
          }`}
          layout
          transition={{ duration: 0.2 }}
        >
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: processedMessage }}
            data-testid={TEST_IDS.messagePreview}
          />
        </motion.div>

        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <Toast
                key={index}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </Toast>
            ))}
          </div>
        )}

        {children}
      </div>
    </Card>
  );
};

export default NotificationTemplatePreview;