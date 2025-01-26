import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { greetingMessageSchema } from '../utils/holidayGreetings';

interface UseGreetingFormProps {
  onSave: (message: string) => Promise<void>;
  onGenerateAI?: () => Promise<string>;
}

const formSchema = z.object({
  message: z.string()
    .min(5, 'Message must be at least 5 characters')
    .max(500, 'Message must be less than 500 characters'),
});

type FormData = z.infer<typeof formSchema>;

export function useGreetingForm({ onSave, onGenerateAI }: UseGreetingFormProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  const { watch, setValue, formState } = form;
  const messageFromForm = watch('message') || '';

  useEffect(() => {
    const savedDraft = localStorage.getItem('greetingDraft');
    if (savedDraft) {
      setMessage(savedDraft);
      setIsDirty(true);
    }
  }, []);

  useEffect(() => {
    if (message) {
      localStorage.setItem('greetingDraft', message);
    }
  }, [message]);

  const validate = useCallback((data: FormData) => {
    try {
      formSchema.parse(data);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        err.errors.forEach((error) => {
          if (error.path[0]) {
            formattedErrors[error.path[0].toString()] = error.message;
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    if (isDirty) {
      validate({ message });
    }
  }, [message, validate, isDirty]);

  const handleMessageChange = useCallback((newMessage: string) => {
    setMessage(newMessage);
    setIsDirty(true);
  }, []);

  const handleSave = async () => {
    setError(null);
    const isValid = validate({ message });
    if (!isValid) return;

    try {
      setIsLoading(true);
      await onSave(message);
      localStorage.removeItem('greetingDraft');
    } catch (err) {
      setError('Failed to save greeting');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!onGenerateAI) return;

    try {
      setIsGenerating(true);
      const generatedMessage = await onGenerateAI();
      setMessage(generatedMessage);
      setIsDirty(true);
    } catch (err) {
      setError('Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  const isValid = useCallback(() => {
    try {
      formSchema.parse({ message });
      return true;
    } catch {
      return false;
    }
  }, [message]);

  const characterCount = message?.length || 0;

  return {
    message,
    setMessage: handleMessageChange,
    isLoading,
    isGenerating,
    error,
    errors,
    isValid: isValid(),
    isDirty,
    characterCount,
    handleSave,
    handleGenerateAI,
    form,
  };
}
