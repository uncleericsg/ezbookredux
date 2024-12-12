import React, { useState } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import type { ServiceCategory } from '../../types';
import type { AppointmentType } from '../../services/categoryMapping';
import { mapCategory } from '../../services/categoryMapping';

interface CategoryMappingModalProps {
  category: ServiceCategory;
  appointmentTypes: AppointmentType[];
  onClose: () => void;
  onSave: () => void;
}

const CategoryMappingModal: React.FC<CategoryMappingModalProps> = ({
  category,
  appointmentTypes,
  onClose,
  onSave
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState(category.acuityAppointmentTypeId || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const appointmentType = appointmentTypes.find(type => type.id === selectedTypeId);
      if (!appointmentType) return;

      await mapCategory(category, appointmentType);
      onSave();
    } catch (error) {
      console.error('Failed to save mapping:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/75">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Map Category to Appointment Type</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="bg-gray-700 rounded-lg px-4 py-2 text-gray-300">
              {category.name}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Appointment Type
            </label>
            <select
              value={selectedTypeId}
              onChange={(e) => setSelectedTypeId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            >
              <option value="">Select an appointment type</option>
              {appointmentTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.duration} mins)
                </option>
              ))}
            </select>
          </div>

          {category.parentId && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-sm text-blue-400">
                    This is a sub-category. You can:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-300 mt-2">
                    <li>Map it to a specific appointment type</li>
                    <li>Leave it empty to inherit from parent</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !selectedTypeId}
              className="btn btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMappingModal;