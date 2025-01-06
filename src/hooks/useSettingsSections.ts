import { useState, useEffect } from 'react';

export const SECTION_IDS = {
  APP_SETTINGS: 'app-settings',
  REPAIR_SHOPR: 'repair-shopr',
  STRIPE: 'stripe',
  CHATGPT: 'chatgpt',
  NOTIFICATIONS: 'notifications',
  CYPRESS: 'cypress',
  BACKUP: 'backup'
} as const;

export const useSettingsSections = () => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const stored = localStorage.getItem('admin-settings-sections');
    return stored ? JSON.parse(stored) : {
      [SECTION_IDS.APP_SETTINGS]: true,
      [SECTION_IDS.REPAIR_SHOPR]: false,
      [SECTION_IDS.STRIPE]: false,
      [SECTION_IDS.CHATGPT]: false,
      [SECTION_IDS.NOTIFICATIONS]: false,
      [SECTION_IDS.CYPRESS]: false,
      [SECTION_IDS.BACKUP]: false
    };
  });

  useEffect(() => {
    localStorage.setItem('admin-settings-sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const isSectionExpanded = (sectionId: string) => {
    return expandedSections[sectionId] ?? false;
  };

  return {
    expandedSections,
    isSectionExpanded,
    toggleSection
  };
};