import { motion } from 'framer-motion';
import React from 'react';

import { useSettingsForm } from '../../hooks/useSettingsForm';
import { updateAdminSettings, fetchAdminSettings } from '../../services/admin';
import type { AdminSettings } from '../../types/settings';

import BrandingSettings from './BrandingSettings';
import BuildManager from './BuildManager';
import CypressSettings from './CypressSettings';
import FloatingSaveButton from './FloatingSaveButton';

const defaultSettings: AdminSettings = {
  integrations: {
    repairShopr: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    stripe: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    chatGPT: {
      enabled: false,
      apiKey: '',
      maxTokens: 500,
      rateLimit: {
        maxRequests: 50,
        windowMs: 60000
      }
    },
    cypress: {
      enabled: false,
      apiKey: '',
      rateLimit: {
        maxRequests: 100,
        windowMs: 60000
      }
    },
    fcm: {
      enabled: false,
      maxTokens: 500,
      rateLimit: {
        maxRequests: 500,
        windowMs: 60000
      }
    }
  },
  branding: {
    logo: {
      url: '/logo.png',
      width: 200,
      height: 50
    },
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#ffd700'
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  },
  app: {
    loginScreenEnabled: false,
    chatGPTSettings: {
      apiKey: '',
      model: 'gpt-3.5-turbo',
      enabled: false,
      maxTokens: 500,
      temperature: 0.7,
      rateLimit: {
        maxRequests: 50,
        windowMs: 60000
      }
    },
    cypressSettings: {
      cypressApiKey: '',
      cypressEnabled: false
    },
    stripeSettings: {
      stripePublishableKey: '',
      stripeSecretKey: '',
      stripeEnabled: false
    },
    repairShoprSettings: {
      repairShoprApiKey: '',
      repairShoprEnabled: false,
      repairShoprFieldMappings: {},
      defaultIntervalWeeks: 11
    }
  }
};

interface CypressSettingsProps {
  settings: AdminSettings;
  updateSettings: (settings: Partial<AdminSettings>) => void;
  loading: boolean;
}

const SettingsPage: React.FC = () => {
  const {
    settings,
    loading,
    hasChanges,
    updateSettings,
    handleSave
  } = useSettingsForm<AdminSettings>(
    defaultSettings,
    updateAdminSettings,
    fetchAdminSettings
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <CypressSettings 
        settings={settings}
        updateSettings={updateSettings}
        loading={loading}
      />
      <BrandingSettings />
      <BuildManager />
      <FloatingSaveButton
        loading={loading}
        onClick={handleSave}
        visible={hasChanges}
      />
    </motion.div>
  );
};

export default SettingsPage;