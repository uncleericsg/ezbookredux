import React, { useState } from 'react';
import { Edit, Save, X, Calendar, MessageSquare, AlertTriangle, Gift } from 'lucide-react';
import { useHolidayList } from '../../hooks/useHolidayList';
import { useHolidayGreetings } from '../../hooks/useHolidayGreetings';
import { toast } from 'sonner';
import type { HolidayGreeting, Holiday } from '../../types';
import type { AdminSettings } from '../../types/settings';
import { format, parseISO } from 'date-fns';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Spinner } from '../../components/ui/spinner';
import { cn } from '../../lib/utils';

interface HolidayListProps {
  className?: string;
  settings: AdminSettings;
}

const HolidayList: React.FC<HolidayListProps> = ({ className, settings }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HolidayGreeting>>({});
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { holidays, loading: holidaysLoading } = useHolidayList();
  const { 
    holidayGreetings, 
    loading: greetingsLoading, 
    updateGreeting, 
    generateGreeting,
    error: greetingsError 
  } = useHolidayGreetings({ chatGPTSettings: settings?.app?.chatGPTSettings });

  const loading = holidaysLoading || greetingsLoading;

  const handleEdit = async (holiday: Holiday) => {
    const existingGreeting = holidayGreetings.find(g => g.id === holiday.date);
    setEditingId(holiday.date);
    setEditForm({
      id: holiday.date,
      holiday: holiday.name,
      date: holiday.date,
      message: existingGreeting?.message || '',
      enabled: existingGreeting?.enabled ?? true,
      sendTime: existingGreeting?.sendTime || `${holiday.date}T00:00:00Z`
    });
    setShowPreview(null);
  };

  const handleSave = async (holiday: Holiday) => {
    try {
      if (!editForm.message) {
        toast.error('Message cannot be empty');
        return;
      }

      await updateGreeting({
        id: holiday.date,
        holiday: holiday.name,
        date: holiday.date,
        message: editForm.message,
        enabled: editForm.enabled ?? true,
        sendTime: editForm.sendTime || `${holiday.date}T00:00:00Z`
      });

      setEditingId(null);
      setEditForm({});
      toast.success('Holiday greeting updated successfully');
    } catch (error) {
      toast.error('Failed to update holiday greeting');
    }
  };

  const handleGenerate = async (holiday: Holiday) => {
    try {
      setIsGenerating(true);
      const message = await generateGreeting(
        `Generate a holiday greeting for ${holiday.name}`,
        `Holiday: ${holiday.name}, Date: ${holiday.date}`,
        'formal'
      );
      setEditForm((prev: Partial<HolidayGreeting>) => ({ ...prev, message }));
      toast.success('Message generated successfully');
    } catch (error) {
      toast.error('Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full animate-pulse">
            <div className="flex flex-row items-center gap-4 p-4">
              <div className="h-12 w-12 rounded-full bg-gray-300" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 bg-gray-300" />
                <div className="h-3 w-1/4 bg-gray-300" />
              </div>
            </div>
            <div className="p-4">
              <div className="h-24 w-full bg-gray-300" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (greetingsError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <div className="flex items-center gap-2 text-red-700 p-4">
          <AlertTriangle className="h-5 w-5" />
          <p>Failed to load holiday greetings. Please try again later.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {holidays.map((holiday) => {
        const isEditing = editingId === holiday.date;
        const greeting = holidayGreetings.find(g => g.id === holiday.date);
        const formattedDate = format(parseISO(holiday.date), 'MMM d, yyyy');

        return (
          <Card key={holiday.date} className="w-full">
            <div className="flex flex-row items-start gap-4 p-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <Gift className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{holiday.name}</h3>
                  <Badge variant={greeting?.enabled ? 'default' : 'warning'}>
                    {greeting?.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </div>
            <div className="px-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      value={editForm.message}
                      onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full min-h-[100px] p-3 rounded-md border focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter holiday greeting message..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Send Time</label>
                    <Input
                      type="datetime-local"
                      value={editForm.sendTime?.slice(0, 16)}
                      onChange={(e) => setEditForm(prev => ({ ...prev, sendTime: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editForm.enabled}
                      onChange={(e) => setEditForm(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <label className="text-sm">Enable greeting</label>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {greeting?.message ? (
                    <p className="text-gray-700">{greeting.message}</p>
                  ) : (
                    <p className="text-gray-500 italic">No message set</p>
                  )}
                </div>
              )}
            </div>
            <div className="px-4 pb-4">
              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(null);
                        setEditForm({});
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerate(holiday)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Spinner className="h-4 w-4 mr-2" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      Generate
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSave(holiday)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(holiday)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default HolidayList;