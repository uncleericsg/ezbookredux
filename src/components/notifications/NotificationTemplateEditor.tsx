import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Save, Eye, Copy, History, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DOMPurify from 'dompurify';
import debounce from 'lodash/debounce';
import type {
  Template,
  TemplateType,
  TemplateCategory
} from './types/templateTypes';
import { templateSchema } from './types/templateTypes';
import type { EnhancedTemplate } from './adapters/types';
import { isEnhancedTemplate } from './adapters/types';
import { extractVariables, createAutosave } from './utils/templateUtils';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Toast,
  Spinner
} from '@/components/ui';
import { withTemplateFeatures } from './enhancers/withTemplateFeatures';

type FormData = Omit<Template, 'id' | 'version' | 'lastModified' | 'createdBy' | 'isActive' | 'features'>;

interface EditorProps {
  template: Template | EnhancedTemplate;
  onSave: (template: Template) => Promise<void>;
  onPreview: (preview: string) => void;
  userId: string;
  permissions?: string[];
  isLoading?: boolean;
}

const AUTOSAVE_DELAY = 1000;

const NotificationTemplateEditor: FC<EditorProps> = ({
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
  } = useForm<FormData>({
    resolver: zodResolver(templateSchema.omit({ 
      id: true, 
      version: true, 
      lastModified: true, 
      createdBy: true,
      isActive: true,
      features: true
    })),
    defaultValues: {
      name: initialTemplate.name,
      description: initialTemplate.description,
      content: initialTemplate.content,
      type: initialTemplate.type,
      category: initialTemplate.category,
      userType: initialTemplate.userType,
      variables: initialTemplate.variables,
      tags: initialTemplate.tags,
      permissions: initialTemplate.permissions
    }
  });

  const queryClient = useQueryClient();
  const [showVersions, setShowVersions] = useState(false);
  const [variables, setVariables] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const saveMutation = useMutation({
    mutationFn: onSave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
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
    await saveMutation.mutateAsync({
      ...initialTemplate,
      ...data,
      lastModified: new Date().toISOString()
    });
  });

  const debouncedAutosave = useCallback(
    debounce((data: FormData) => {
      createAutosave({
        ...initialTemplate,
        ...data,
        lastModified: new Date().toISOString()
      }, userId);
    }, AUTOSAVE_DELAY),
    [userId, initialTemplate]
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
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
          </div>
          <div className="h-64 w-full bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
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
              onClick={() => setShowVersions(true)}
              className="gap-2"
            >
              <History className="h-4 w-4" />
              Versions
            </Button>
            <Button
              onClick={() => onPreview(watchedContent)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </Button>
          </div>

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
                  <Toast className="mt-2">
                    {errors.content.message}
                  </Toast>
                )}
              </div>
            )}
          />

          {variables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Badge key={variable}>
                  <Tag className="h-3 w-3 mr-1" />
                  {variable}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  className="w-32"
                  error={!!errors.type}
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="push">Push</option>
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
                  <option value="marketing">Marketing</option>
                  <option value="transactional">Transactional</option>
                  <option value="reminder">Reminder</option>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Last modified: {new Date(initialTemplate.lastModified).toLocaleDateString()}
        </div>
      </div>
    </Card>
  );
};

export default withTemplateFeatures(NotificationTemplateEditor);