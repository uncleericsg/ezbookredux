import React, { useState, useMemo, useCallback } from 'react';
import { Copy, AlertCircle, Smartphone, Monitor, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import type { Template, EnhancedTemplate } from './types/templateTypes';
import { PreviewData } from './types/messageTypes';
import { TEST_IDS } from './constants/templateConstants';
import { PreviewAdapter } from './adapters/previewAdapter';
import { ValidationAdapter } from './adapters/validationAdapter';
import { TemplateAdapter } from './adapters/templateAdapter';
import { withTemplateFeatures } from './enhancers/withTemplateFeatures';
import { Card, CardContent, CardHeader } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Badge } from '@components/atoms/badge';
import { Spinner } from '@components/atoms/spinner';
import { Skeleton } from '@components/atoms/skeleton';
import { Toast } from '@components/molecules/toast';

interface TemplatePreviewProps {
  template: Template | EnhancedTemplate;
  sampleData?: PreviewData;
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const previewAdapter = new PreviewAdapter();
const validationAdapter = new ValidationAdapter();
const templateAdapter = new TemplateAdapter();

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

  // Enhance template if needed
  const enhancedTemplate = useMemo(() => {
    return templateAdapter.enhance(template);
  }, [template]);

  // Create preview configuration
  const previewConfig = useMemo(() => {
    return previewAdapter.createPreviewConfig(enhancedTemplate, previewMode, sampleData);
  }, [enhancedTemplate, previewMode, sampleData]);

  // Process message with preview data
  const processedMessage = useMemo(() => {
    return previewAdapter.processMessage(enhancedTemplate.message, previewConfig);
  }, [enhancedTemplate.message, previewConfig]);

  // Get character count
  const characterCount = useMemo(() => {
    return previewAdapter.getCharacterCount(processedMessage);
  }, [processedMessage]);

  // Get validation errors
  const validationErrors = useMemo(() => {
    return validationAdapter.validate(enhancedTemplate, previewConfig);
  }, [enhancedTemplate, previewConfig]);

  const handleCopy = useCallback(() => {
    try {
      navigator.clipboard.writeText(processedMessage);
      setIsCopied(true);
      toast({ title: 'Success', description: 'Message copied to clipboard' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to copy message', 
        variant: 'destructive' 
      });
    }
  }, [processedMessage, toast]);

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-9 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Preview</h3>
          <Badge variant={validationErrors.length > 0 ? 'destructive' : 'success'}>
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
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
          <div className="mt-4 space-y-2">
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
      </CardContent>
    </Card>
  );
};

export default withTemplateFeatures(React.memo(NotificationTemplatePreview));