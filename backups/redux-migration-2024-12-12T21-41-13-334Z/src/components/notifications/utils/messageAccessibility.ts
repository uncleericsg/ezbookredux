import { useEffect, useRef, KeyboardEvent } from 'react';

export const ARIA_LABELS = {
  messageContent: 'Message content',
  urlInput: 'Destination URL',
  dateInput: 'Schedule date',
  timeInput: 'Schedule time',
  frequencySelect: 'Message frequency',
  userTypeSelect: 'Target user group',
  previewButton: 'Preview message',
  scheduleButton: 'Schedule message',
  closeButton: 'Close',
  utmSource: 'UTM source',
  utmMedium: 'UTM medium',
  utmCampaign: 'UTM campaign',
};

export function useKeyboardNavigation(containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown as any);
    return () => container.removeEventListener('keydown', handleKeyDown as any);
  }, [containerRef]);
}

export function useAnnouncement() {
  const announcer = useRef<HTMLDivElement | null>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcer.current) {
      announcer.current = document.createElement('div');
      announcer.current.setAttribute('aria-live', priority);
      announcer.current.setAttribute('aria-atomic', 'true');
      announcer.current.className = 'sr-only';
      document.body.appendChild(announcer.current);
    }

    announcer.current.textContent = message;
  };

  useEffect(() => {
    return () => {
      if (announcer.current) {
        document.body.removeChild(announcer.current);
      }
    };
  }, []);

  return announce;
}

export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setIsHighContrast(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsHighContrast(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isHighContrast;
}

export const accessibilityClasses = {
  srOnly: 'sr-only',
  focusVisible: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  highContrast: {
    input: 'high-contrast:border-black high-contrast:bg-white high-contrast:text-black',
    button: 'high-contrast:bg-black high-contrast:text-white high-contrast:border-white',
    text: 'high-contrast:text-black',
  },
};

export function getAriaLabel(key: keyof typeof ARIA_LABELS): string {
  return ARIA_LABELS[key];
}

export function useAriaLive() {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return {
    message,
    priority,
    announce: (newMessage: string, newPriority: 'polite' | 'assertive' = 'polite') => {
      setMessage(newMessage);
      setPriority(newPriority);
    },
  };
}
