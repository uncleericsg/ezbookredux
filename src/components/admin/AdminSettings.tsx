import { 
  Archive, 
  Bell, 
  CreditCard, 
  Key, 
  MessageSquare, 
  TestTube, 
  Users 
} from 'lucide-react';
import React, { useCallback } from 'react';
import { toast } from 'sonner';

import BuildManager from '@components/admin/BuildManager';
import ChatGPTSettings from '@components/admin/ChatGPTSettings';
import CypressSettings from '@components/admin/CypressSettings';
import FCMTester from '@components/admin/FCMTester';
import LoginScreenSettings from '@components/admin/LoginScreenSettings';
import RepairShoprSettings from '@components/admin/RepairShoprSettings';
import SettingsBackup from '@components/admin/SettingsBackup';
import SettingsSection from '@components/admin/SettingsSection';
import StripeSettings from '@components/admin/StripeSettings';

import { updateAppSettings, fetchAppSettings } from '@services/appSettings';
import type { AppError } from '@shared/types/error';
import { useSettingsForm } from '@hooks/useSettingsForm';
import { useSettingsSections, SECTION_IDS } from '@hooks/useSettingsSections';

import type { AppSettings } from '@shared/types/appSettings';
import type { AdminSettings } from '@shared/types/settings';
import { defaultSettings } from '@shared/types/settings';

// Default settings
const defaultAppSettings: AppSettings = {
  loginScreenEnabled: false,
  chatGPTSettings: {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    enabled: false,
    maxTokens: 500,
    temperature: 0.7
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
};

// Convert AppSettings to AdminSettings
const mapToAdminSettings = (appSettings: AppSettings): AdminSettings => ({
  ...defaultSettings,
  app: appSettings
});

// Base props interface for all settings components
interface BaseSettingsProps {
  loading: boolean;
}

interface SaveableProps extends BaseSettingsProps {
  onSave: () => Promise<void>;
}

// Settings component props
interface AppSettingsProps extends SaveableProps {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

interface AdminSettingsProps extends BaseSettingsProps {
  settings: AdminSettings;
  updateSettings: (updates: Partial<AdminSettings>) => void;
}

// Wrapper components
const AppSettingsWrapper: React.FC<AppSettingsProps & { children: React.ReactElement }> = ({
  settings,
  loading,
  updateSettings,
  onSave,
  children
}) => {
  return React.cloneElement(children, {
    settings,
    loading,
    updateSettings,
    onSave
  });
};

interface AdminWrapperProps {
  settings: AppSettings;
  loading: boolean;
  updateSettings: (updates: Partial<AppSettings>) => void;
  onSave?: () => Promise<void>;
  children: React.ReactElement;
}

const AdminSettingsWrapper: React.FC<AdminWrapperProps> = ({
  settings,
  loading,
  updateSettings,
  onSave,
  children
}) => {
  const adminSettings = mapToAdminSettings(settings);
  const handleUpdate = useCallback((updates: Partial<AdminSettings>) => {
    if (updates.app) {
      updateSettings(updates.app);
    }
  }, [updateSettings]);

  const props = {
    settings: adminSettings,
    loading,
    updateSettings: handleUpdate,
    ...(onSave && { onSave })
  };

  return React.cloneElement(children, props);
};

const AdminSettings: React.FC = () => {
  const {
    settings: appSettings,
    loading: appLoading,
    updateSettings: updateAppSettingsState,
    handleSave: handleAppSave
  } = useSettingsForm<AppSettings>(
    defaultAppSettings,
    async (settings) => {
      await updateAppSettings(settings);
    },
    fetchAppSettings
  );

  const { isSectionExpanded, toggleSection } = useSettingsSections();

  const handleSettingsSave = useCallback(async () => {
    try {
      await handleAppSave();
      toast.success('Settings saved successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(errorMessage);
    }
  }, [handleAppSave]);

  const handleTestChatGPT = async () => {
    try {
      const response = await fetch('/api/chatgpt/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: appSettings.chatGPTSettings?.apiKey,
          model: appSettings.chatGPTSettings?.model
        }),
      });

      if (!response.ok) {
        throw new Error('ChatGPT test failed');
      }

      toast.success('ChatGPT integration test successful');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'ChatGPT test failed';
      toast.error(errorMessage);
    }
  };

  const commonProps = {
    loading: appLoading || false,
    updateSettings: updateAppSettingsState,
    settings: appSettings
  };

  const saveableProps = {
    ...commonProps,
    onSave: handleAppSave
  };

  return (
    <div className="space-y-6 pb-32">
      <SettingsSection
        id={SECTION_IDS.APP_SETTINGS}
        title="Application Settings"
        icon={<Users />}
        expanded={isSectionExpanded(SECTION_IDS.APP_SETTINGS)}
        onToggle={() => toggleSection(SECTION_IDS.APP_SETTINGS)}
      >
        <AppSettingsWrapper {...saveableProps}>
          <LoginScreenSettings
            settings={appSettings}
            loading={appLoading || false}
            updateSettings={updateAppSettingsState}
            onSave={handleAppSave}
          />
        </AppSettingsWrapper>
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.REPAIR_SHOPR}
        title="RepairShopr Integration"
        icon={<Key />}
        expanded={isSectionExpanded(SECTION_IDS.REPAIR_SHOPR)}
        onToggle={() => toggleSection(SECTION_IDS.REPAIR_SHOPR)}
      >
        <AdminSettingsWrapper {...saveableProps}>
          <RepairShoprSettings
            settings={mapToAdminSettings(appSettings)}
            loading={appLoading || false}
            updateSettings={(updates) => {
              if (updates.app) {
                updateAppSettingsState(updates.app);
              }
            }}
            onSave={handleAppSave}
          />
        </AdminSettingsWrapper>
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.STRIPE}
        title="Stripe Integration"
        icon={<CreditCard />}
        expanded={isSectionExpanded(SECTION_IDS.STRIPE)}
        onToggle={() => toggleSection(SECTION_IDS.STRIPE)}
      >
        <AdminSettingsWrapper {...saveableProps}>
          <StripeSettings
            settings={mapToAdminSettings(appSettings)}
            loading={appLoading || false}
            updateSettings={(updates) => {
              if (updates.app) {
                updateAppSettingsState(updates.app);
              }
            }}
            onSave={handleAppSave}
          />
        </AdminSettingsWrapper>
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.CHATGPT}
        title="ChatGPT Integration"
        icon={<MessageSquare />}
        expanded={isSectionExpanded(SECTION_IDS.CHATGPT)}
        onToggle={() => toggleSection(SECTION_IDS.CHATGPT)}
      >
        <ChatGPTSettings
          settings={appSettings.chatGPTSettings}
          loading={appLoading || false}
          updateSettings={(updates) => updateAppSettingsState({
            chatGPTSettings: updates
          })}
          onSave={handleAppSave}
          onTest={handleTestChatGPT}
        />
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.NOTIFICATIONS}
        title="Push Notifications"
        icon={<Bell />}
        expanded={isSectionExpanded(SECTION_IDS.NOTIFICATIONS)}
        onToggle={() => toggleSection(SECTION_IDS.NOTIFICATIONS)}
      >
        <FCMTester />
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.CYPRESS}
        title="Cypress Testing"
        icon={<TestTube />}
        expanded={isSectionExpanded(SECTION_IDS.CYPRESS)}
        onToggle={() => toggleSection(SECTION_IDS.CYPRESS)}
      >
        <AdminSettingsWrapper {...commonProps}>
          <CypressSettings
            settings={mapToAdminSettings(appSettings)}
            loading={appLoading || false}
            updateSettings={(updates) => {
              if (updates.app) {
                updateAppSettingsState(updates.app);
              }
            }}
          />
        </AdminSettingsWrapper>
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.BACKUP}
        title="Settings Backup"
        icon={<Archive />}
        expanded={isSectionExpanded(SECTION_IDS.BACKUP)}
        onToggle={() => toggleSection(SECTION_IDS.BACKUP)}
      >
        <SettingsBackup />
      </SettingsSection>

      <BuildManager />
    </div>
  );
};

AdminSettings.displayName = 'AdminSettings';

export { AdminSettings };
export default AdminSettings;
