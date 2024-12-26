import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface FieldMapping {
  id: string;
  userField: string;
  repairShoprField: string;
  defaultValue?: string;
  transform?: string;
}

interface RepairShoprMappingProps {
  onSave: (mappings: FieldMapping[]) => Promise<void>;
}

const defaultFields = [
  { label: 'First Name', value: 'firstName' },
  { label: 'Last Name', value: 'lastName' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Address', value: 'address' },
  { label: 'AMC Status', value: 'amcStatus' },
  { label: 'Service History', value: 'serviceHistory' }
];

const repairShoprFields = [
  { label: 'First Name', value: 'first_name' },
  { label: 'Last Name', value: 'last_name' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Address', value: 'address' },
  { label: 'Customer Type', value: 'customer_type' },
  { label: 'Service Notes', value: 'service_notes' }
];

const RepairShoprMapping: React.FC<RepairShoprMappingProps> = ({ onSave }) => {
  const [mappings, setMappings] = useState<FieldMapping[]>([
    {
      id: '1',
      userField: 'firstName',
      repairShoprField: 'first_name'
    },
    {
      id: '2',
      userField: 'lastName',
      repairShoprField: 'last_name'
    },
    {
      id: '3',
      userField: 'email',
      repairShoprField: 'email'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const addMapping = () => {
    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      userField: '',
      repairShoprField: ''
    };
    setMappings([...mappings, newMapping]);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
  };

  const updateMapping = (id: string, updates: Partial<FieldMapping>) => {
    setMappings(mappings.map(m => 
      m.id === id ? { ...m, ...updates } : m
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate mappings
    const invalidMappings = mappings.filter(m => !m.userField || !m.repairShoprField);
    if (invalidMappings.length > 0) {
      toast.error('Please complete all field mappings');
      return;
    }

    try {
      setLoading(true);
      await onSave(mappings);
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

      <form onSubmit={handleSubmit} className="space-y-6">
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
                    User Profile Field
                  </label>
                  <select
                    value={mapping.userField}
                    onChange={(e) => updateMapping(mapping.id, { userField: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  >
                    <option value="">Select field...</option>
                    {defaultFields.map(field => (
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

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeMapping(mapping.id)}
                  className="btn-icon text-red-400"
                  title="Remove mapping"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={addMapping}
            className="btn btn-secondary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Field Mapping
          </button>

          <button
            type="submit"
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
      </form>
    </div>
  );
};

export default RepairShoprMapping;