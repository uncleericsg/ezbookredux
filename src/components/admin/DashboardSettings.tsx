'use client';

import { Save } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { cn } from '@/utils/cn';
import { 
  DashboardConfig,
  DashboardSettingsProps,
  defaultDashboardConfig,
  DashboardView,
  DashboardTheme,
  DashboardDensity 
} from '@shared/types/dashboard-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DashboardSettings: React.FC<DashboardSettingsProps> = ({
  settings = defaultDashboardConfig,
  onSave,
  loading = false,
  className,
  ...props
}) => {
  const [config, setConfig] = React.useState<DashboardConfig>(settings);
  const [activeTab, setActiveTab] = React.useState('general');

  React.useEffect(() => {
    setConfig(settings);
  }, [settings]);

  const handleSave = async () => {
    try {
      await onSave(config);
      toast.success('Dashboard settings saved successfully');
    } catch (error) {
      toast.error('Failed to save dashboard settings');
      console.error('Error saving dashboard settings:', error);
    }
  };

  const updateSettings = <K extends keyof DashboardConfig>(
    key: K,
    value: DashboardConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
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
                value={config.defaultView}
                onValueChange={(value: DashboardView) => updateSettings('defaultView', value)}
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
                value={config.itemsPerPage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  updateSettings('itemsPerPage', parseInt(e.target.value, 10))
                }
                min={1}
                max={100}
              />
            </div>
          </TabsContent>

          <TabsContent value="display" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={config.theme}
                onValueChange={(value: DashboardTheme) => updateSettings('theme', value)}
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
                value={config.density}
                onValueChange={(value: DashboardDensity) => updateSettings('density', value)}
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
                    checked={config.notifications.emailDaily}
                    onCheckedChange={(checked: boolean) =>
                      updateSettings('notifications', {
                        ...config.notifications,
                        emailDaily: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly Report</span>
                  <Switch
                    checked={config.notifications.emailWeekly}
                    onCheckedChange={(checked: boolean) =>
                      updateSettings('notifications', {
                        ...config.notifications,
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
                    checked={config.notifications.pushImportant}
                    onCheckedChange={(checked: boolean) =>
                      updateSettings('notifications', {
                        ...config.notifications,
                        pushImportant: checked
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Task Reminders</span>
                  <Switch
                    checked={config.notifications.pushReminders}
                    onCheckedChange={(checked: boolean) =>
                      updateSettings('notifications', {
                        ...config.notifications,
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

export default DashboardSettings;
