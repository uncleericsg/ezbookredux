import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Calendar,
  Clock,
  MessageSquare,
  Save,
  X,
  Gift,
  AlertTriangle,
} from 'lucide-react';
import type { Holiday, HolidayGreeting } from '../../types';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/organisms/dialog';
import { Button } from '@components/atoms/button';
import { Input } from '@components/atoms/input';
import { Textarea } from '@components/atoms/textarea';
import { Label } from '@components/atoms/label';
import { Switch } from '@components/atoms/switch';
import { Spinner } from '@components/atoms/spinner';
import { Badge } from '@components/atoms/badge';
import { Alert, AlertTitle, AlertDescription } from '@components/atoms/alert';

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
  const [message, setMessage] = useState(existingGreeting?.message || '');
  const [enabled, setEnabled] = useState(existingGreeting?.enabled ?? true);
  const [sendTime, setSendTime] = useState(
    existingGreeting?.sendTime || `${holiday.date}T09:00:00Z`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setError(null);
      setIsSaving(true);

      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      await onSave({
        id: holiday.date,
        holiday: holiday.name,
        date: holiday.date,
        message: message.trim(),
        enabled,
        sendTime,
      });

      toast.success('Holiday greeting saved successfully');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save greeting');
      toast.error('Failed to save greeting');
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
                {message.length} characters
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
                  value={sendTime.split('T')[1].slice(0, 5)}
                  onChange={(e) => {
                    const [date] = sendTime.split('T');
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
            disabled={isSaving}
          >
            {isSaving ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HolidayGreetingModal;