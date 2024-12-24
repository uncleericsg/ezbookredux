import { Save, Loader2, Key, Info, TestTube2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import type { AcuitySettings as AcuitySettingsType } from '../../types/settings';
import { Dialog } from '../ui/Dialog';
import { Tooltip } from '../ui/Tooltip';
import { useState } from 'react';

const settingsSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
  userId: z.string().min(1, 'User ID is required'),
  enabled: z.boolean(),
  defaultIntervalWeeks: z.number().min(10).max(12)
});

type FormData = z.infer<typeof settingsSchema>;

interface AcuitySettingsProps {
  settings: AcuitySettingsType;
  loading?: boolean;
  updateSettings: (updates: Partial<AcuitySettingsType>) => void;
  onSave: () => Promise<void>;
}

const AcuitySettings: React.FC<AcuitySettingsProps> = ({
  settings,
  loading = false,
  updateSettings,
  onSave
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      apiKey: settings.apiKey,
      userId: settings.userId,
      enabled: settings.enabled,
      defaultIntervalWeeks: settings.defaultIntervalWeeks
    }
  });

  const enabled = watch('enabled');

  const handleFormSubmit = async (data: FormData) => {
    try {
      updateSettings(data);
      await onSave();
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Save error:', error);
    }
  };

  const handleEnableToggle = (checked: boolean) => {
    if (!checked && settings.enabled) {
      setShowConfirmDialog(true);
    } else {
      updateSettings({ enabled: checked });
    }
  };

  const handleTestConnection = async () => {
    const { apiKey, userId } = getValues();
    if (!apiKey || !userId) {
      toast.error('Please enter API Key and User ID first');
      return;
    }
    
    setTestingConnection(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/acuity/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, userId }),
      });
      
      if (response.ok) {
        toast.success('Connection test successful!');
      } else {
        toast.error('Connection test failed. Please check your credentials.');
      }
    } catch (error) {
      toast.error('Connection test failed. Please check your credentials.');
      console.error('Test connection error:', error);
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6">Acuity Integration</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-blue-400" />
              <span>API Key</span>
              <Tooltip content="Enter your Acuity API key. You can find this in your Acuity account settings.">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          </label>
          <input
            type="password"
            id="apiKey"
            {...register('apiKey')}
            className={`w-full bg-gray-700 border ${
              errors.apiKey ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-100`}
            placeholder="Enter Acuity API Key"
          />
          {errors.apiKey && (
            <p className="mt-1 text-sm text-red-500">{errors.apiKey.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="userId" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <span>User ID</span>
              <Tooltip content="Your Acuity user identifier. This is used to associate appointments with your account.">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          </label>
          <input
            type="text"
            id="userId"
            {...register('userId')}
            className={`w-full bg-gray-700 border ${
              errors.userId ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-100`}
            placeholder="Enter Acuity User ID"
          />
          {errors.userId && (
            <p className="mt-1 text-sm text-red-500">{errors.userId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-300 mb-1">
            <div className="flex items-center space-x-2">
              <span>Default Service Interval</span>
              <Tooltip content="The default time interval between regular maintenance services.">
                <Info className="h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          </label>
          <select
            id="interval"
            {...register('defaultIntervalWeeks', { valueAsNumber: true })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100"
          >
            <option value={10}>10 weeks</option>
            <option value={11}>11 weeks (75 days)</option>
            <option value={12}>12 weeks</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              {...register('enabled')}
              onChange={(e) => handleEnableToggle(e.target.checked)}
              className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
            />
            <label htmlFor="enabled" className="ml-2 text-sm text-gray-300">
              Enable Acuity Integration
            </label>
          </div>
          
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingConnection || !enabled}
            className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testingConnection ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <TestTube2 className="h-4 w-4" />
            )}
            <span>Test Connection</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !isDirty}
          className="w-full btn btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </form>

      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="Disable Integration?"
        description="Are you sure you want to disable the Acuity integration? This will affect appointment scheduling and synchronization."
        confirmLabel="Disable Integration"
        cancelLabel="Cancel"
        onConfirm={() => {
          updateSettings({ enabled: false });
          setShowConfirmDialog(false);
        }}
      />
    </div>
  );
};

AcuitySettings.displayName = 'AcuitySettings';

export { AcuitySettings };
export default AcuitySettings;