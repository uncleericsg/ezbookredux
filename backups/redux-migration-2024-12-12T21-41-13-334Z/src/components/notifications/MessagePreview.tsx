import React, { useMemo, useState, useEffect } from 'react';
import { ExternalLink, X, Copy, AlertTriangle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageFormData } from './utils/messageValidation';
import { PreviewData, MessageTemplate, MESSAGE_LIMITS, MessageType } from './types/messageTypes';
import { useProcessedMessage, useCharacterCount, useUrlWithUtm } from './hooks/useMessageProcessing';
import { messageTemplates } from './data/messageTemplates';
import { toast } from 'sonner';
import { withTemplateFeatures } from './enhancers/withTemplateFeatures';
import { Card, CardContent, CardHeader, CardFooter } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Badge } from '@components/atoms/badge';
import { Toast } from '@components/molecules/toast';
import { Skeleton } from '@components/atoms/skeleton';

interface MessagePreviewProps {
  message: Partial<MessageFormData>;
  previewData?: Partial<PreviewData>;
  onClose: () => void;
  onTemplateSelect?: (template: MessageTemplate) => void;
  isLoading?: boolean;
}

/**
 * MessagePreview Component
 * 
 * Displays a preview of a message with variable substitution, UTM tracking,
 * and template selection. Includes character count and limit warnings.
 * 
 * @param message - The message data to preview
 * @param previewData - Sample data for variable substitution
 * @param onClose - Callback when preview is closed
 * @param onTemplateSelect - Optional callback when a template is selected
 * @param isLoading - Optional loading state
 */
export const MessagePreview: React.FC<MessagePreviewProps> = ({
  message,
  previewData = {
    first_name: 'John',
    last_name: 'Doe',
    last_service_date: '2024-01-15',
    next_service_date: '2024-04-15',
    service_type: 'General Service',
    technician_name: 'Mike Smith',
    appointment_time: '10:00 AM',
    customer_address: '123 Main St',
    contact_number: '9123 4567'
  },
  onClose,
  onTemplateSelect,
  isLoading = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [copied, setCopied] = useState(false);

  const processedContent = useProcessedMessage(message.content, previewData);
  const characterCount = useCharacterCount(processedContent);
  const messageType: MessageType = message.type || 'sms';
  const characterLimit = MESSAGE_LIMITS[messageType];
  const isOverLimit = characterCount > characterLimit;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedContent);
      setCopied(true);
      toast.success('Message copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect?.(template);
    toast.success('Template applied successfully');
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto animate-pulse">
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Message Preview</h3>
          <Badge variant={isOverLimit ? 'destructive' : 'success'}>
            {characterCount} / {characterLimit}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
            disabled={isOverLimit}
          >
            {copied ? (
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
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          className="rounded-lg bg-gray-50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="prose dark:prose-invert max-w-none">
            {processedContent}
          </div>
          {isOverLimit && (
            <Toast
              variant="destructive"
              className="mt-4 flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              Message exceeds character limit
            </Toast>
          )}
        </motion.div>
      </CardContent>
      {messageTemplates.length > 0 && (
        <CardFooter className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">Suggested Templates</h4>
          <div className="grid grid-cols-2 gap-2">
            {messageTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                size="sm"
                onClick={() => handleTemplateSelect(template)}
                className="justify-start gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {template.name}
              </Button>
            ))}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default withTemplateFeatures(React.memo(MessagePreview));
