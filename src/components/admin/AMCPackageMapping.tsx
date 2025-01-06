import { Save, AlertTriangle, Loader2, Link } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { AMCPackage, AppointmentType } from '../../types';

interface AMCPackageMappingProps {
  package: AMCPackage;
  onSave: (packageId: string, appointmentTypeId: string) => Promise<void>;
}

// Local appointment types for AMC services
const defaultAppointmentTypes: AppointmentType[] = [
  {
    id: 'amc-regular',
    name: 'AMC Regular Service',
    duration: 90,
    isAMC: true,
    description: 'Regular maintenance service for AMC customers'
  },
  {
    id: 'amc-emergency',
    name: 'AMC Emergency Service',
    duration: 120,
    isAMC: true,
    description: 'Emergency service for AMC customers'
  },
  {
    id: 'amc-inspection',
    name: 'AMC Inspection',
    duration: 60,
    isAMC: true,
    description: 'Routine inspection for AMC customers'
  }
];

const AMCPackageMapping: React.FC<AMCPackageMappingProps> = ({
  package: pkg,
  onSave
}) => {
  const [selectedTypeId, setSelectedTypeId] = useState(pkg.appointmentTypeId || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedTypeId) {
      toast.error('Please select an appointment type');
      return;
    }

    try {
      setSaving(true);
      await onSave(pkg.id, selectedTypeId);
      toast.success('Package mapping updated successfully');
    } catch (error) {
      toast.error('Failed to update package mapping');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-gray-400">
        <Link className="h-4 w-4" />
        <span>Map to Service Type</span>
      </div>

      <select
        value={selectedTypeId}
        onChange={(e) => setSelectedTypeId(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
      >
        <option value="">Select service type...</option>
        {defaultAppointmentTypes.map(type => (
          <option key={type.id} value={type.id}>
            {type.name} ({type.duration} mins)
          </option>
        ))}
      </select>

      {!selectedTypeId && (
        <div className="flex items-start space-x-2 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <AlertTriangle className="h-5 w-5 mt-0.5" />
          <p className="text-sm">
            Mapping to a service type is required for proper scheduling
          </p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !selectedTypeId}
        className="w-full btn btn-primary flex items-center justify-center space-x-2"
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            <span>Save Mapping</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AMCPackageMapping;