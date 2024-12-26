import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

interface FieldMapping {
  id: string;
  systemField: string;
  repairShoprField: string;
  required: boolean;
  defaultValue?: string;
  transform?: string;
}

const systemFields = [
  { label: 'First Name', value: 'firstName', required: true },
  { label: 'Last Name', value: 'lastName', required: true },
  { label: 'Email', value: 'email', required: true },
  { label: 'Mobile Number', value: 'phone', required: false },
  { label: 'Address Line 1', value: 'addressLine1', required: false },
  { label: 'Address Line 2', value: 'addressLine2', required: false },
  { label: 'Postal Code', value: 'postalCode', required: false },
  { label: 'Online Profile URL', value: 'profileUrl', required: false }
];

const repairShoprFields = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Address', value: 'address' },
  { label: 'Address Line 2', value: 'address2' },
  { label: 'Zip', value: 'zip' },
  { label: 'Online Portal URL', value: 'portal_url' }
];

const mappingSchema = z.object({
  systemField: z.string().min(1, 'System field is required'),
  repairShoprField: z.string().min(1, 'RepairShopr field is required'),
  defaultValue: z.string().optional(),
  transform: z.string().optional()
});

const UserImportMapping: React.FC = () => {
  const [mappings, setMappings] = useState<FieldMapping[]>([
    {
      id: '1',
      systemField: 'firstName',
      repairShoprField: 'first_name',
      required: true
    },
    {
      id: '2',
      systemField: 'lastName',
      repairShoprField: 'last_name',
      required: true
    },
    {
      id: '3',
      systemField: 'email',
      repairShoprField: 'email',
      required: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const addMapping = () => {
    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      systemField: '',
      repairShoprField: '',
      required: false
    };
    setMappings([...mappings, newMapping]);
  };

  const removeMapping = (id: string) => {
    const mapping = mappings.find(m => m.id === id);
    if (mapping?.required) {
      toast.error('Cannot remove required field mapping');
      return;
    }
    setMappings(mappings.filter(m => m.id !== id));
  };

  const updateMapping = (id: string, updates: Partial<FieldMapping>) => {
    setMappings(mappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const validateMappings = (): boolean => {
    const errors: string[] = [];

    // Check required fields
    const requiredFields = systemFields.filter(f => f.required);
    for (const field of requiredFields) {
      const hasMapping = mappings.some(m => 
        m.systemField === field.value && m.repairShoprField
      );
      if (!hasMapping) {
        errors.push(`${field.label} must be mapped`);
      }
    }

    // Check for duplicate mappings
    const repairShoprFieldCounts = mappings.reduce((acc, m) => {
      if (m.repairShoprField) {
        acc[m.repairShoprField] = (acc[m.repairShoprField] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    Object.entries(repairShoprFieldCounts).forEach(([field, count]) => {
      if (count > 1) {
        errors.push(`${field} is mapped multiple times`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSave = async () => {
    if (!validateMappings()) {
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Field mappings saved successfully');
    } catch (error) {
      toast.error('Failed to save field mappings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-6">RepairShopr Field Mapping</h2>

      {validationErrors.length > 0 && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-400 mt-1" />
            <div>
              <h3 className="font-medium text-red-400">Validation Errors</h3>
              <ul className="mt-2 space-y-1 text-sm text-red-400">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {mappings.map((mapping) => (
          <motion.div
            key={mapping.id}
            layout
            className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  System Field {mapping.required && <span className="text-red-400">*</span>}
                </label>
                <select
                  value={mapping.systemField}
                  onChange={(e) => updateMapping(mapping.id, { 
                    systemField: e.target.value,
                    required: systemFields.find(f => f.value === e.target.value)?.required || false
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                >
                  <option value="">Select field...</option>
                  {systemFields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  RepairShopr Field
                </label>
                <select
                  value={mapping.repairShoprField}
                  onChange={(e) => updateMapping(mapping.id, { repairShoprField: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                >
                  <option value="">Select field...</option>
                  {repairShoprFields.map(field => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Default Value (Optional)
                </label>
                <input
                  type="text"
                  value={mapping.defaultValue || ''}
                  onChange={(e) => updateMapping(mapping.id, { defaultValue: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  placeholder="Enter default value..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Transform (Optional)
                </label>
                <input
                  type="text"
                  value={mapping.transform || ''}
                  onChange={(e) => updateMapping(mapping.id, { transform: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  placeholder="e.g., toLowerCase(), toUpperCase()"
                />
              </div>
            </div>

            {!mapping.required && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => removeMapping(mapping.id)}
                  className="btn-icon text-red-400"
                  title="Remove mapping"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={addMapping}
          className="btn btn-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Field Mapping
        </button>

        <button
          onClick={handleSave}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Mappings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserImportMapping;