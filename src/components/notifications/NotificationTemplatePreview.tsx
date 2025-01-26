import React, { useState, useMemo } from 'react';
import { Copy, AlertCircle, Smartphone, Monitor, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { ValidationAdapter } from './adapters/validationAdapter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { processTemplate } from './adapters/previewAdapter';
import type { NotificationTemplate } from '@/types/notifications';

interface TemplatePreviewProps {
  template: NotificationTemplate;
  sampleData?: Record<string, any>;
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function NotificationTemplatePreview({
  template,
  sampleData,
  children,
  className,
  isLoading = false,
}: TemplatePreviewProps) {
  const { toast } = useToast();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const processedMessage = useMemo(() => {
    if (!template?.content) return '';
    return processTemplate(template.content, sampleData);
  }, [template?.content, sampleData]);

  const validationErrors = useMemo(() => {
    if (!template) return [];
    return ValidationAdapter.validate(template).errors;
  }, [template]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(processedMessage);
      setIsCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'The message has been copied to your clipboard.',
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy the message to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Preview</h3>
          {validationErrors.length > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5">
              {validationErrors.length} {validationErrors.length === 1 ? 'error' : 'errors'}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(isDesktop && 'bg-muted')}
            onClick={() => setIsDesktop(true)}
            aria-label="Desktop view"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(!isDesktop && 'bg-muted')}
            onClick={() => setIsDesktop(false)}
            aria-label="Mobile view"
          >
            <Smartphone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            aria-label="Copy message"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2" data-testid="loading-skeleton">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        ) : (
          <motion.div
            key={isDesktop ? 'desktop' : 'mobile'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="whitespace-pre-wrap text-sm">{processedMessage}</div>
            {validationErrors.length > 0 && (
              <div className="space-y-2">
                {validationErrors.map((error, index) => (
                  <div
                    key={index}
                    className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive"
                  >
                    {error}
                  </div>
                ))}
              </div>
            )}
            {children}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}