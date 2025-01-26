import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MessageSquare,
  Save,
  X,
  Gift,
  AlertTriangle,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Alert, AlertTitle, AlertDescription } from '@components/ui/alert';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Spinner } from '@components/ui/spinner';
import { Switch } from '@components/ui/switch';
import { Textarea } from '@components/ui/textarea';

import type { Holiday, HolidayGreeting } from '@types';

interface HolidayGreetingModalProps {
  holiday: Holiday;
  isOpen: boolean;
  onClose: () => void;
  onSave: (greeting: HolidayGreeting) => Promise<void>;
  existingGreeting?: HolidayGreeting;
  onGenerateMessage?: (holiday: Holiday) => Promise<string>;
}

const HolidayGreetingModal: React.FC<HolidayGreetingModalProps> = ({
  holiday,
  isOpen,
  onClose,
  onSave,
  existingGreeting,
  onGenerateMessage,
}) => {
  const [message, setMessage] = useState<string>('');
  const [enabled, setEnabled] = useState(false);
  const [sendTime, setSendTime] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingGreeting) {
      setMessage(existingGreeting.message || '');
      setEnabled(existingGreeting.enabled || false);
      setSendTime(existingGreeting.sendTime || null);
    }
  }, [existingGreeting]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      await onSave({
        ...holiday,
        message: message.trim(),
        enabled,
        sendTime
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save greeting');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!onGenerateMessage) return;

    try {
      setError(null);
      setIsGenerating(true);
      const generatedMessage = await onGenerateMessage(holiday);
      setMessage(generatedMessage);
      toast.success('Message generated successfully');
    } catch (err) {
      setError('Failed to generate message');
      toast.error('Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-blue-500" />
            <DialogTitle>{holiday.name} Greeting</DialogTitle>
          </div>
          <DialogDescription>
            Create or edit the greeting message for {holiday.name}.
            Messages will be sent on {format(new Date(holiday.date), 'MMMM d, yyyy')}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">Message</Label>
              {onGenerateMessage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Spinner size="sm" className="mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  Generate
                </Button>
              )}
            </div>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your holiday greeting message..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Badge variant="secondary">
                {message?.length || 0} characters
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sendTime">Send Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="sendTime"
                  type="time"
                  value={sendTime?.split('T')[1].slice(0, 5) || ''}
                  onChange={(e) => {
                    const [date] = sendTime?.split('T') || [];
                    setSendTime(`${date}T${e.target.value}:00Z`);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="enabled">Status</Label>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="enabled" className="text-sm">
                    {enabled ? 'Active' : 'Inactive'}
                  </Label>
                </div>
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !(message?.trim())}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayGreetingModal;