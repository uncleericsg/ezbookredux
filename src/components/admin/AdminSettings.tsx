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

import BuildManager from '@admin/BuildManager';
import ChatGPTSettings from '@admin/ChatGPTSettings';
import CypressSettings from '@admin/CypressSettings';
import FCMTester from '@admin/FCMTester';
import LoginScreenSettings from '@admin/LoginScreenSettings';
import RepairShoprSettings from '@admin/RepairShoprSettings';
import SettingsBackup from '@admin/SettingsBackup';
import SettingsSection from '@admin/SettingsSection';
import StripeSettings from '@admin/StripeSettings';

import { updateAppSettings, fetchAppSettings } from '@services/appSettings';

import { useSettingsForm } from '@hooks/useSettingsForm';
import { useSettingsSections, SECTION_IDS } from '@hooks/useSettingsSections';

import type { AppSettings } from '../../types/appSettings';
import { defaultAppSettings } from '../../types/appSettings';

const AdminSettings = () => {
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
    async () => {
      const settings = await fetchAppSettings();
      return {
        ...defaultAppSettings,
        ...settings
      } as AppSettings;
    }
  );

  const { isSectionExpanded, toggleSection } = useSettingsSections();

  const handleSettingsSave = useCallback(async () => {
    try {
      await handleAppSave();
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
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
    } catch (error) {
      toast.error('ChatGPT test failed');
    }
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
        <LoginScreenSettings
          settings={appSettings}
          loading={appLoading}
          updateSettings={updateAppSettingsState}
          onSave={handleAppSave}
        />
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.REPAIR_SHOPR}
        title="RepairShopr Integration"
        icon={<Key />}
        expanded={isSectionExpanded(SECTION_IDS.REPAIR_SHOPR)}
        onToggle={() => toggleSection(SECTION_IDS.REPAIR_SHOPR)}
      >
        <RepairShoprSettings
          settings={appSettings}
          loading={appLoading}
          updateSettings={updateAppSettingsState}
          onSave={handleAppSave}
        />
      </SettingsSection>

      <SettingsSection
        id={SECTION_IDS.STRIPE}
        title="Stripe Integration"
        icon={<CreditCard />}
        expanded={isSectionExpanded(SECTION_IDS.STRIPE)}
        onToggle={() => toggleSection(SECTION_IDS.STRIPE)}
      >
        <StripeSettings
          settings={appSettings}
          loading={appLoading}
          updateSettings={updateAppSettingsState}
          onSave={handleAppSave}
        />
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
          loading={appLoading}
          updateSettings={(updates) => updateAppSettingsState({ chatGPTSettings: updates })}
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
        <CypressSettings
          settings={appSettings.cypressSettings || { cypressApiKey: '', cypressEnabled: false }}
          loading={appLoading}
          updateSettings={(updates) => updateAppSettingsState({ cypressSettings: updates })}
        />
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