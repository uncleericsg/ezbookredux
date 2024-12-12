import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Mail, Globe, Bell, Shield, Database } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <SettingsIcon className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-semibold">System Settings</h2>
      </div>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid gap-8">
          {[
            { icon: Mail, title: 'Email Settings', description: 'Configure SMTP and email templates' },
            { icon: Globe, title: 'Site Settings', description: 'General website configuration' },
            { icon: Bell, title: 'Notification Settings', description: 'Configure notification preferences' },
            { icon: Shield, title: 'Security Settings', description: 'Security and authentication settings' },
            { icon: Database, title: 'Backup Settings', description: 'Database backup configuration' }
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start space-x-4 p-4 border border-gray-700 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
              <Icon className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-gray-400 text-sm mt-1">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
