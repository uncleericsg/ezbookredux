import React, { useState } from 'react';
import { Save, X, MessageSquare, Globe, Clock } from 'lucide-react';
import { useHolidayGreetings } from '../../hooks/useHolidayGreetings';
import type { HolidayGreeting } from '../../types';
import type { ChatGPTSettings } from '../../types/settings';

interface HolidayGreetingFormProps {
  greeting: Partial<HolidayGreeting>;
  onSave: (greeting: HolidayGreeting) => Promise<void>;
  onCancel: () => void;
  chatGPTSettings?: ChatGPTSettings;
}

const HolidayGreetingForm: React.FC<HolidayGreetingFormProps> = ({
  greeting,
  onSave,
  onCancel,
  chatGPTSettings
}) => {
  const [formData, setFormData] = useState(greeting);
  const [tone, setTone] = useState<'formal' | 'casual'>('formal');
  const [language, setLanguage] = useState('en');
  const { generateGreeting, loading } = useHolidayGreetings({ chatGPTSettings });

  const handleGenerateMessage = async () => {
    if (!formData.holiday || !formData.date) return;
    
    const message = await generateGreeting(
      formData.holiday,
      formData.date,
      tone,
      language
    );
    
    if (message) {
      setFormData(prev => ({ ...prev, message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.holiday || !formData.date || !formData.message) return;
    
    await onSave({
      id: formData.id || Date.now().toString(),
      holiday: formData.holiday,
      date: formData.date,
      message: formData.message,
      enabled: formData.enabled ?? true,
      sendTime: formData.sendTime || `${formData.date}T09:00:00Z`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Holiday Name
        </label>
        <input
          type="text"
          value={formData.holiday || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, holiday: e.target.value }))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          placeholder="e.g., Chinese New Year"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Holiday Date
        </label>
        <input
          type="date"
          value={formData.date || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
          required
        />
      </div>

      {chatGPTSettings?.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span>Message Tone</span>
              </div>
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as 'formal' | 'casual')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-blue-400" />
                <span>Language</span>
              </div>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
              <option value="en">English</option>
              <option value="zh">Chinese</option>
              <option value="ms">Malay</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          <div className="flex items-center justify-between">
            <span>Greeting Message</span>
            {chatGPTSettings?.enabled && (
              <button
                type="button"
                onClick={handleGenerateMessage}
                disabled={loading || !formData.holiday || !formData.date}
                className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-50"
              >
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Generate with AI</span>
                </div>
              </button>
            )}
          </div>
        </label>
        <textarea
          value={formData.message || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
          placeholder="Enter greeting message..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-blue-400" />
            <span>Send Time</span>
          </div>
        </label>
        <select
          value={formData.sendTime ? new Date(formData.sendTime).getHours() : 9}
          onChange={(e) => {
            const hours = parseInt(e.target.value);
            const date = new Date(formData.date || '');
            date.setHours(hours, 0, 0, 0);
            setFormData(prev => ({ ...prev, sendTime: date.toISOString() }));
          }}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={i}>
              {i.toString().padStart(2, '0')}:00
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="enabled"
          checked={formData.enabled ?? true}
          onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
        />
        <label htmlFor="enabled" className="ml-2 text-sm text-gray-300">
          Enable Greeting
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Greeting
        </button>
      </div>
    </form>
  );
};

export default HolidayGreetingForm;