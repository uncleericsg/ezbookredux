import React from 'react';
import { Phone, Monitor } from 'lucide-react';
import styles from './PreviewModes.module.css';

interface PreviewModesProps {
  mode: 'mobile' | 'desktop';
  onModeChange?: (mode: 'mobile' | 'desktop') => void;
}

export const PreviewModes: React.FC<PreviewModesProps> = ({
  mode,
  onModeChange
}) => {
  const handleModeChange = (newMode: 'mobile' | 'desktop') => {
    if (onModeChange && newMode !== mode) {
      onModeChange(newMode);
    }
  };

  return (
    <div className={styles.container} role="group" aria-label="Preview mode selection">
      <button
        className={`${styles.button} ${mode === 'desktop' ? styles.active : ''}`}
        onClick={() => handleModeChange('desktop')}
        aria-pressed={mode === 'desktop'}
        aria-label="Desktop preview mode"
        data-testid="desktop-mode-button"
      >
        <Monitor className={styles.icon} />
        <span>Desktop</span>
      </button>

      <button
        className={`${styles.button} ${mode === 'mobile' ? styles.active : ''}`}
        onClick={() => handleModeChange('mobile')}
        aria-pressed={mode === 'mobile'}
        aria-label="Mobile preview mode"
        data-testid="mobile-mode-button"
      >
        <Phone className={styles.icon} />
        <span>Mobile</span>
      </button>
    </div>
  );
};
