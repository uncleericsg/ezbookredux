import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Eye, Copy, History, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import debounce from 'lodash/debounce';
import {
  Template,
  validateTemplate,
  extractVariables,
  createAutosave,
  createVersion,
  previewTemplate,
  templateSchema
} from './utils/templateUtils';
import { ErrorBoundary } from '@components/error-boundary';
import { Card, CardContent, CardHeader, CardFooter } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { Select, SelectOption } from '@components/molecules/select';
import { Badge } from '@components/atoms/badge';
import { Toast } from '@components/molecules/toast';
import { Spinner } from '@components/atoms/spinner';
import { withTemplateFeatures } from './enhancers/withTemplateFeatures';

interface Props {
  template: Template;
  onSave: (template: Template) => Promise<void>;
  onPreview: (preview: string) => void;
  userId: string;
  permissions?: string[];
  isLoading?: boolean;
}

const AUTOSAVE_DELAY = 1000;
const MAX_VERSIONS_SHOWN = 5;

const NotificationTemplateEditor: React.FC<Props> = ({
  template: initialTemplate,
  onSave,
  onPreview,
  userId,
  permissions = [],
  isLoading = false
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm<Template>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialTemplate
  });

  const queryClient = useQueryClient();
  const [showVersions, setShowVersions] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const saveMutation = useMutation({
    mutationFn: onSave,
    onSuccess: () => {
      queryClient.invalidateQueries(['templates']);
      toast.success('Template saved successfully');
      setIsSaving(false);
    },
    onError: (error) => {
      toast.error('Failed to save template');
      setIsSaving(false);
    }
  });

  const handleSave = handleSubmit(async (data) => {
    setIsSaving(true);
    await saveMutation.mutateAsync(data);
  });

  const debouncedAutosave = useCallback(
    debounce((data: Template) => {
      createAutosave(data, userId);
    }, AUTOSAVE_DELAY),
    [userId]
  );

  const watchedContent = watch('content');
  
  useEffect(() => {
    if (isDirty && watchedContent) {
      const newVariables = extractVariables(watchedContent);
      setVariables(newVariables);
      debouncedAutosave(watch());
    }
  }, [watchedContent, isDirty, debouncedAutosave, watch]);

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-24 bg-gray-200 rounded" />
            <div className="h-9 w-24 bg-gray-200 rounded" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Template Name"
                className="text-lg font-semibold"
                error={!!errors.name}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Template Description"
                className="text-sm text-gray-500"
                error={!!errors.description}
              />
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVersions(true)}
            className="gap-2"
          >
            <History className="h-4 w-4" />
            Versions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(watchedContent)}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Spinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <textarea
                  {...field}
                  className="w-full min-h-[200px] p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder="Enter your template content here..."
                />
                {errors.content && (
                  <Toast
                    variant="destructive"
                    className="mt-2"
                  >
                    {errors.content.message}
                  </Toast>
                )}
              </div>
            )}
          />
          {variables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Badge key={variable} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {variable}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-32"
                error={!!errors.type}
              >
                <SelectOption value="sms">SMS</SelectOption>
                <SelectOption value="email">Email</SelectOption>
                <SelectOption value="push">Push</SelectOption>
              </Select>
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                className="w-40"
                error={!!errors.category}
              >
                <SelectOption value="marketing">Marketing</SelectOption>
                <SelectOption value="transactional">Transactional</SelectOption>
                <SelectOption value="reminder">Reminder</SelectOption>
              </Select>
            )}
          />
        </div>
        <div className="text-sm text-gray-500">
          Last modified: {new Date(initialTemplate.updatedAt).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default withTemplateFeatures(React.memo(NotificationTemplateEditor));