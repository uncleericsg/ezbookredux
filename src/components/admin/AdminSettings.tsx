import React from 'react';
import AcuitySettings from './AcuitySettings';
import LoginScreenSettings from './LoginScreenSettings';
import ComponentIntegration from './ComponentIntegration';
import RepairShoprSettings from './RepairShoprSettings';
import StripeSettings from './StripeSettings';
import ChatGPTSettings from './ChatGPTSettings';
import FCMTester from './FCMTester';
import CypressSettings from './CypressSettings';
import BuildManager from './BuildManager';
import SettingsBackup from './SettingsBackup';
import { useCallback } from 'react';
import { useSettingsForm } from '../../hooks/useSettingsForm';
import { useSettingsSections, SECTION_IDS } from '../../hooks/useSettingsSections';
import SettingsSection from './SettingsSection';
import { defaultSettings } from '../../types/settings';
import { defaultAppSettings } from '../../types/appSettings';
import { updateAcuitySettings } from '../../services/admin';
import { updateAppSettings } from '../../services/appSettings';
import { fetchAppSettings } from '../../services/appSettings';
import { toast } from 'sonner';
import { Settings, Book, Key, CreditCard, MessageSquare, Bell, TestTube, Archive, Save, Users, Calendar } from 'lucide-react';

// Mock fetch functions for development
const fetchAcuitySettings = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultSettings);
    }, 500);
  });
};

const AdminSettings: React.FC = () => {
  const {
    settings: acuitySettings,
    loading: acuityLoading,
    updateSettings: updateAcuitySettingsState,
    handleSave: handleAcuitySave
  } = useSettingsForm(
    defaultSettings,
    updateAcuitySettings,
    fetchAcuitySettings
  );

  const {
    settings: appSettings,
    loading: appLoading,
    updateSettings: updateAppSettingsState,
    handleSave: handleAppSave
  } = useSettingsForm(
    defaultAppSettings,
    updateAppSettings,
    fetchAppSettings
  );

  const { isSectionExpanded, toggleSection } = useSettingsSections();

  const handleSettingsSave = useCallback(async () => {
    try {
      await Promise.all([
        handleAcuitySave(),
        handleAppSave()
      ]);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  }, [handleAcuitySave, handleAppSave]);

  const handleTestChatGPT = async () => {
    try {
      const response = await fetch('/api/chatgpt/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: acuitySettings.chatGPTSettings?.apiKey,
          model: acuitySettings.chatGPTSettings?.model
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
        id={SECTION_IDS.ACUITY}
        title="Acuity Integration"
        icon={<Calendar />}
        expanded={isSectionExpanded(SECTION_IDS.ACUITY)}
        onToggle={() => toggleSection(SECTION_IDS.ACUITY)}
      >
        <AcuitySettings
          settings={acuitySettings}
          loading={acuityLoading}
          updateSettings={updateAcuitySettingsState}
          onSave={handleAcuitySave}
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
          settings={acuitySettings}
          loading={acuityLoading}
          updateSettings={updateAcuitySettingsState}
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
          settings={acuitySettings}
          loading={acuityLoading}
          updateSettings={updateAcuitySettingsState}
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
          settings={acuitySettings.chatGPTSettings}
          loading={acuityLoading}
          updateSettings={(updates) => updateAcuitySettingsState({ chatGPTSettings: updates })}
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
          settings={acuitySettings}
          loading={acuityLoading}
          updateSettings={updateAcuitySettingsState}
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

export default AdminSettings;