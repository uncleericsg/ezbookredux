'use client';

import { Save } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '../../lib/utils';
import type { DashboardSettings as DashboardSettingsType } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

export interface DashboardSettingsProps {
  config: {
    showRevenueChart: boolean;
    showBookingStats: boolean;
    showCustomerStats: boolean;
    defaultDateRange: string;
    refreshInterval: number;
  };
  onSave: (config: any) => void;
  loading?: boolean;
}

export const DashboardSettings = ({
  settings: initialSettings,
  onSave,
  loading = false,
  className,
  ...props
}: DashboardSettingsProps) => {
  const [settings, setSettings] = useState<DashboardSettingsType>(initialSettings);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = async () => {
    try {
      await onSave(settings);
      toast.success('Dashboard settings saved successfully');
    } catch (error) {
      toast.error('Failed to save dashboard settings');
      console.error('Error saving dashboard settings:', error);
    }
  };

  const updateSettings = <K extends keyof DashboardSettingsType>(
    key: K,
    value: DashboardSettingsType[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={cn('', className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Dashboard Settings</span>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label>Default View</Label>
              <Select
                value={settings.defaultView}
                onValueChange={(value) => updateSettings('defaultView', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Items Per Page</Label>
              <Input
                type="number"
                value={settings.itemsPerPage}
                onChange={(e) => updateSettings('itemsPerPage', parseInt(e.target.value))}
                min={1}
                max={100}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) => updateSettings('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Density</Label>
              <Select
                value={settings.density}
                onValueChange={(value) => updateSettings('density', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select density" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-2">
              <Label>Email Notifications</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Daily Summary</span>
                  <Switch
                    checked={settings.notifications?.emailDaily}
                    onCheckedChange={(checked) =>
                      updateSettings('notifications', {
                        ...settings.notifications,
                        emailDaily: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly Report</span>
                  <Switch
                    checked={settings.notifications?.emailWeekly}
                    onCheckedChange={(checked) =>
                      updateSettings('notifications', {
                        ...settings.notifications,
                        emailWeekly: checked
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Push Notifications</Label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Important Updates</span>
                  <Switch
                    checked={settings.notifications?.pushImportant}
                    onCheckedChange={(checked) =>
                      updateSettings('notifications', {
                        ...settings.notifications,
                        pushImportant: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Task Reminders</span>
                  <Switch
                    checked={settings.notifications?.pushReminders}
                    onCheckedChange={(checked) =>
                      updateSettings('notifications', {
                        ...settings.notifications,
                        pushReminders: checked
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

DashboardSettings.displayName = 'DashboardSettings';

undefined.displayName = 'undefined';