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
    .min(1, 'Message is required')
    .max(500, 'Message must be less than 500 characters'),
});

type FormData = z.infer<typeof formSchema>;

export function useGreetingForm({ onSave, onGenerateAI }: UseGreetingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
    mode: 'onChange',
  });

  const { watch, setValue, formState } = form;
  const message = watch('message') || '';

  useEffect(() => {
    const formErrors = formState.errors;
    const validationErrors: string[] = [];
    
    if (formErrors.message) {
      validationErrors.push(formErrors.message.message || 'Message is required');
    } else if (message.length === 0) {
      validationErrors.push('Message is required');
    } else if (message.length > 500) {
      validationErrors.push('Message must be less than 500 characters');
    }
    
    setErrors(validationErrors);
  }, [formState.errors, message]);

  const setMessage = useCallback((newMessage: string) => {
    setValue('message', newMessage);
    setUndoStack(prev => [...prev, message]);
    setRedoStack([]);
  }, [setValue, message]);

  // Auto-save draft
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('greetingDraft', message);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [message]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('greetingDraft');
    if (draft) {
      setValue('message', draft);
    }
  }, [setValue]);

  const handleSave = useCallback(async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrors([]);
      await form.trigger('message');
      
      if (form.formState.errors.message) {
        setErrors([form.formState.errors.message.message || 'Invalid message']);
        return;
      }
      
      await onSave(data.message);
      localStorage.removeItem('greetingDraft');
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to save message']);
    } finally {
      setIsLoading(false);
    }
  }, [onSave, form]);

  const handleGenerateAI = useCallback(async () => {
    if (!onGenerateAI) return;

    try {
      setIsGenerating(true);
      setErrors([]);
      if (message) {
        setUndoStack(prev => [...prev, message]);
      }
      
      const generatedMessage = await onGenerateAI();
      setValue('message', generatedMessage);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Failed to generate AI message']);
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerateAI, setValue, message]);

  const handleUndo = useCallback(() => {
    const lastMessage = undoStack[undoStack.length - 1];
    
    if (lastMessage) {
      setRedoStack(prev => [...prev, message]);
      setUndoStack(prev => prev.slice(0, -1));
      setValue('message', lastMessage);
    }
  }, [setValue, message, undoStack]);

  const handleRedo = useCallback(() => {
    const lastMessage = redoStack[redoStack.length - 1];
    
    if (lastMessage) {
      setUndoStack(prev => [...prev, message]);
      setRedoStack(prev => prev.slice(0, -1));
      setValue('message', lastMessage);
    }
  }, [setValue, message, redoStack]);

  const isValid = !formState.errors.message && message.length > 0;
  const isDirty = formState.isDirty;
  const characterCount = message?.length || 0;

  return {
    message,
    setMessage,
    isValid,
    isDirty,
    characterCount,
    errors,
    isLoading,
    isGenerating,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    handleSave,
    handleGenerateAI,
    handleUndo,
    handleRedo,
    form,
  };
}
