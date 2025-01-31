import { getToken } from 'firebase/messaging';
import { Send, Users, Clock, AlertTriangle, Loader2, Bell } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useFCM } from '@hooks/useFCM';
import { messaging } from '@services/firebase';

import type { NotificationPayload } from '@services/fcm';

interface FCMTesterProps {
  className?: string;
}

const FCMTester: React.FC<FCMTesterProps> = () => {
  const [token, setToken] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high'>('normal');
  const [scheduledTime, setScheduledTime] = useState('');
  const [testResults, setTestResults] = useState<{
    success: number;
    failed: number;
    errors: string[];
  }>({
    success: 0,
    failed: 0,
    errors: []
  });

  const { sendNotification, sendMulticast, scheduleNotification, loading } = useFCM({
    onSuccess: (response) => {
      if ('successCount' in response) {
        setTestResults(prev => ({
          ...prev,
          success: prev.success + response.successCount,
          failed: prev.failed + response.failureCount
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          success: prev.success + 1
        }));
      }
    },
    onError: (error) => {
      setTestResults(prev => ({
        ...prev,
        failed: prev.failed + 1,
        errors: [...prev.errors, error.message]
      }));
    }
  });

  const handleRequestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
        });
        if (currentToken) {
          setToken(currentToken);
          toast.success('Notification permission granted');
        }
      } else {
        toast.error('Notification permission denied');
      }
    } catch (error) {
      console.error('Failed to get notification permission:', error);
      toast.error('Failed to get notification permission');
    }
  };

  const handleSingleSend = async () => {
    const payload: NotificationPayload = {
      title,
      body: message
    };
    await sendNotification(token, payload, priority);
  };

  // Handle multicast notifications
  const handleMulticast = async () => {
    const payload: NotificationPayload = {
      title,
      body: message
    };
    await sendMulticast(tokens, payload, priority);

  };

  // Handle scheduled notifications
  const handleSchedule = async () => {
    const payload: NotificationPayload = {
      title,
      body: message
    };
    await scheduleNotification(token, payload, new Date(scheduledTime), priority);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6">FCM Integration Tester</h2>

      {/* Permission Request */}
      <div className="mb-6">
        <button
          onClick={handleRequestPermission}
          className="btn btn-primary w-full"
        >
          Request Notification Permission
        </button>
      </div>

      {/* Test Results */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <h3 className="text-green-400 font-medium mb-1">Successful</h3>
          <p className="text-2xl font-bold">{testResults.success}</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-1">Failed</h3>
          <p className="text-2xl font-bold">{testResults.failed}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h3 className="text-blue-400 font-medium mb-1">Success Rate</h3>
          <p className="text-2xl font-bold">
            {testResults.success + testResults.failed === 0 
              ? '0'
              : Math.round((testResults.success / (testResults.success + testResults.failed)) * 100)
            }%
          </p>
        </div>
      </div>

      {testResults.errors.length > 0 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h3 className="font-medium text-red-400">Errors</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-400">
            {testResults.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Single Device Test */}
        <div>
          <h3 className="text-lg font-medium mb-4">Single Device Test</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="FCM Token"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSingleSend}
              disabled={loading || !token || !title || !message}
              className="btn btn-primary w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Test Notification
            </button>
          </div>
        </div>

        {/* Multicast Test */}
        <div>
          <h3 className="text-lg font-medium mb-4">Multicast Test</h3>
          <div className="space-y-4">
            <textarea
              value={tokens.join('\n')}
              onChange={(e) => setTokens(e.target.value.split('\n').filter(Boolean))}
              placeholder="Enter FCM tokens (one per line)"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            />
            <button
              onClick={handleMulticast}
              disabled={loading || tokens.length === 0 || !title || !message}
              className="btn btn-primary w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              Send to Multiple Devices
            </button>
          </div>
        </div>

        {/* Scheduled Test */}
        <div>
          <h3 className="text-lg font-medium mb-4">Schedule Test</h3>
          <div className="space-y-4">
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleSchedule}
              disabled={loading || !token || !title || !message || !scheduledTime}
              className="btn btn-primary w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Notification
            </button>
          </div>
        </div>

        {/* Common Settings */}
        <div className="border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Notification Content</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Notification Title"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification Message"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'normal' | 'high')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-center">Processing notification...</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component
export default FCMTester;