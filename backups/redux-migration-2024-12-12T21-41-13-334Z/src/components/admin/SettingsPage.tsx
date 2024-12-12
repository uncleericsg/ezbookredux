import React from 'react';
import { motion } from 'framer-motion';
import AcuitySettings from './AcuitySettings';
import CypressSettings from './CypressSettings';
import BrandingSettings from './BrandingSettings';
import BuildManager from './BuildManager';
import FloatingSaveButton from './FloatingSaveButton';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { updateAcuitySettings } from '../../services/admin';

const SettingsPage: React.FC = () => {
  const {
    settings,
    loading,
    hasChanges,
    updateSettings,
    handleSave
  } = useSettingsForm({
    apiKey: '',
    userId: '',
    enabled: true,
    defaultIntervalWeeks: 11,
    cypressApiKey: '',
    cypressEnabled: false
  }, updateAcuitySettings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <AcuitySettings 
        settings={settings}
        updateSettings={updateSettings}
        loading={loading}
      />
      <CypressSettings 
        settings={settings}
        updateSettings={updateSettings}
        loading={loading}
      />
      <BrandingSettings />
      <BuildManager />
    </motion.div>
  );
};

export default SettingsPage;