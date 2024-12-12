import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Send, AlertTriangle, X, Save, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useCustomMessages } from '../../hooks/useCustomMessages';
import { useAcuitySettings } from '../../hooks/useAcuitySettings';
import type { CustomMessage } from '../../types';

import { Card } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { Textarea } from '@components/atoms/textarea';
import { Badge } from '@components/atoms/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/molecules/select';
import { Label } from '@components/atoms/label';
import { Spinner } from '@components/atoms/spinner';
import { Alert, AlertTitle, AlertDescription } from '@components/atoms/alert';
import { Separator } from '@components/atoms/separator';

interface FormData {
  message: string;
  scheduledDate: string;
  scheduledTime: string;
  recipients: string[];
}

const CustomMessageScheduler: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { settings } = useAcuitySettings();
  const { messages, loading, error, scheduleMessage, generateMessage } = useCustomMessages();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      message: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: format(new Date(), 'HH:mm'),
      recipients: []
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      const scheduledDateTime = `${data.scheduledDate}T${data.scheduledTime}:00`;
      await scheduleMessage({
        message: data.message,
        scheduledDateTime,
        recipients: data.recipients
      });
      toast.success('Message scheduled successfully');
      reset();
    } catch (error) {
      toast.error('Failed to schedule message');
    }
  };

  const handleGenerateMessage = async () => {
    try {
      setIsGenerating(true);
      const generatedMessage = await generateMessage();
      setValue('message', generatedMessage);
      toast.success('Message generated successfully');
    } catch (error) {
      toast.error('Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Message</Label>
              {settings?.chatGPTSettings?.enabled && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateMessage}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Generate Message
                </Button>
              )}
            </div>
            <Textarea
              id="message"
              {...register('message', { required: 'Message is required' })}
              className="min-h-[120px]"
              placeholder="Enter your message here..."
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="scheduledDate"
                  type="date"
                  {...register('scheduledDate', { required: 'Date is required' })}
                  className="pl-10"
                />
              </div>
              {errors.scheduledDate && (
                <p className="text-sm text-red-500">{errors.scheduledDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="scheduledTime"
                  type="time"
                  {...register('scheduledTime', { required: 'Time is required' })}
                  className="pl-10"
                />
              </div>
              {errors.scheduledTime && (
                <p className="text-sm text-red-500">{errors.scheduledTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Select
              onValueChange={(value) => setValue('recipients', [value])}
              defaultValue={watch('recipients')?.[0]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active Customers</SelectItem>
                <SelectItem value="inactive">Inactive Customers</SelectItem>
              </SelectContent>
            </Select>
            {errors.recipients && (
              <p className="text-sm text-red-500">{errors.recipients.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Schedule Message
            </Button>
          </div>
        </form>
      </Card>

      {messages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Scheduled Messages</h3>
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm">{message.message}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(message.scheduledDateTime), 'PPp')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {message.recipients.join(', ')}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      // TODO: Implement delete functionality
                      toast.error('Delete functionality not implemented');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMessageScheduler;