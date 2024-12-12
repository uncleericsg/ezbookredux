import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isAfter } from 'date-fns';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trash2, 
  Edit2, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useScheduledMessages } from '../../hooks/useScheduledMessages';
import type { ScheduledMessage } from '../../types';

import { Card } from '@components/molecules/card';
import { Button } from '@components/atoms/button';
import { Badge } from '@components/atoms/badge';
import { Spinner } from '@components/atoms/spinner';
import { Alert, AlertTitle, AlertDescription } from '@components/atoms/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/atoms/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/organisms/dialog';
import { ScrollArea } from '@components/molecules/scroll-area';

const ScheduledMessagesList: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { messages, loading, error, deleteMessage, updateMessage } = useScheduledMessages();

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setShowDeleteDialog(false);
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusBadge = (message: ScheduledMessage) => {
    const now = new Date();
    const scheduleDate = parseISO(message.scheduledDateTime);
    
    if (message.sent) {
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Sent
        </Badge>
      );
    }
    
    if (message.error) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    }
    
    if (isAfter(scheduleDate, now)) {
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Scheduled
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        Pending
      </Badge>
    );
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

  if (!messages.length) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500">
          <p>No scheduled messages found</p>
        </div>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{message.message}</p>
                    {message.url && (
                      <a
                        href={message.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {message.url}
                      </a>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMessage(message);
                          // TODO: Implement edit functionality
                          toast.error('Edit functionality not implemented');
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => {
                          setSelectedMessage(message);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(message.scheduledDateTime), 'PPp')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {message.recipients.join(', ')}
                  </div>
                  {getStatusBadge(message)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedMessage && handleDelete(selectedMessage.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
};

export default ScheduledMessagesList;