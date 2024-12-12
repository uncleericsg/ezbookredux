import React from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { ServiceVisit } from '../types';

interface ServiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  visits: ServiceVisit[];
  loading?: boolean;
}

const ServiceHistoryModal: React.FC<ServiceHistoryModalProps> = ({
  isOpen,
  onClose,
  visits,
  loading,
}) => {
  if (!isOpen) return null;

  const handleExport = () => {
    const data = visits.map(visit => ({
      Date: format(new Date(visit.date), 'PP'),
      Service: visit.label,
      Status: visit.status,
      Technician: visit.technician,
      Notes: visit.notes,
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'service-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Service History</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {visits.map((visit) => (
              <div
                key={visit.id}
                className="bg-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{visit.label}</h3>
                    <p className="text-sm text-gray-400">
                      {format(new Date(visit.date), 'PPP')}
                    </p>
                    {visit.technician && (
                      <p className="text-sm text-gray-400 mt-1">
                        Technician: {visit.technician}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      visit.status === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : visit.status === 'scheduled'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </span>
                </div>
                {visit.notes && (
                  <p className="mt-2 text-sm text-gray-300 bg-gray-600/50 p-2 rounded">
                    {visit.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceHistoryModal;