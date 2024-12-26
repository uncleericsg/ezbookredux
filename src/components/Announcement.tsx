import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Announcement as AnnouncementType } from '@types';

interface AnnouncementProps {
  announcement: AnnouncementType;
  onDismiss: (id: string) => void;
}

const Announcement: React.FC<AnnouncementProps> = ({ announcement, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem(`announcement_${announcement.id}`);
    if (isDismissed) {
      setIsVisible(false);
    }
  }, [announcement.id]);

  const handleDismiss = () => {
    localStorage.setItem(`announcement_${announcement.id}`, 'true');
    setIsVisible(false);
    onDismiss(announcement.id);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold">{announcement.title}</h2>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-300 mb-6">{announcement.message}</p>
        <button onClick={handleDismiss} className="w-full btn btn-primary">
          Got it
        </button>
      </div>
    </div>
  );
};

export default Announcement;