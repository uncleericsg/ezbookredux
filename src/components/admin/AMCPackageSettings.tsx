import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Star, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { useSettingsForm } from '@hooks/useSettingsForm';
import AMCPackageMapping from '@components/admin/AMCPackageMapping';

interface AMCPackageConfig {
  pageSettings: {
    title: string;
    description: string;
    ctaText: string;
  };
  packages: Array<{
    id: string;
    name: string;
    price: number;
    acuityAppointmentTypeId?: string;
    visits: number;
    features: string[];
    recommended?: boolean;
    active: boolean;
    order: number;
  }>;
  coverage: {
    includedServices: string[];
    limitations: string[];
    exclusions: string[];
    responseTime: string;
    schedule: {
      frequency: 'quarterly' | 'monthly' | 'custom';
      customDays?: number;
    };
  };
  termsAndConditions: {
    content: string;
    version: string;
    effectiveDate: string;
    languages: Array<{
      code: string;
      content: string;
    }>;
  };
}

const defaultConfig: AMCPackageConfig = {
  pageSettings: {
    title: 'Quality AMC Packages',
    description: 'Exclusively for HDB and Condominium Residences',
    ctaText: 'Get Started',
  },
  packages: [
    {
      id: '1-2-units',
      name: '1-2 Units',
      price: 280,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ],
      active: true,
      order: 1
    },
    {
      id: '3-units',
      name: '3 Units',
      price: 380,
      visits: 4,
      features: [
        'Quarterly professional servicing',
        'Advanced PowerJet Wash deep cleaning',
        'Comprehensive system health diagnostics',
        'Performance optimization',
        '90-day service warranty',
        'AI-powered priority booking',
        'Exclusive member discounts'
      ],
      recommended: true,
      active: true,
      order: 2
    }
  ],
  coverage: {
    includedServices: [
      'Regular maintenance visits',
      'System diagnostics',
      'Performance optimization'
    ],
    limitations: [
      'Service hours: 9:30 AM - 5:00 PM',
      'Excludes public holidays'
    ],
    exclusions: [
      'Parts replacement',
      'Major repairs'
    ],
    responseTime: '24 hours',
    schedule: {
      frequency: 'quarterly'
    }
  },
  termsAndConditions: {
    content: 'Standard terms and conditions apply.',
    version: '1.0',
    effectiveDate: new Date().toISOString(),
    languages: []
  }
};

const fetchAMCSettings = async (): Promise<AMCPackageConfig> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(defaultConfig);
    }, 500);
  });
};

const saveAMCSettings = async (settings: AMCPackageConfig): Promise<void> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Saving AMC settings:', settings);
      resolve();
    }, 500);
  });
};

const AMCPackageSettings: React.FC = () => {
  const {
    settings,
    loading,
    updateSettings,
    handleSave
  } = useSettingsForm<AMCPackageConfig>(
    defaultConfig,
    saveAMCSettings,
    fetchAMCSettings
  );

  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const addPackage = () => {
    const newPackage = {
      id: `package-${Date.now()}`,
      name: 'New Package',
      price: 0,
      visits: 4,
      features: [],
      active: true,
      order: settings.packages.length + 1
    };

    updateSettings({
      packages: [...settings.packages, newPackage]
    });
  };

  const removePackage = (id: string) => {
    updateSettings({
      packages: settings.packages.filter(pkg => pkg.id !== id)
    });
  };

  const updatePackage = (id: string, updates: Partial<AMCPackageConfig['packages'][0]>) => {
    updateSettings({
      packages: settings.packages.map(pkg =>
        pkg.id === id ? { ...pkg, ...updates } : pkg
      )
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSave();
      toast.success('AMC package settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Page Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Page Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Page Title
            </label>
            <input
              type="text"
              value={settings.pageSettings.title}
              onChange={(e) => updateSettings({
                pageSettings: { ...settings.pageSettings, title: e.target.value }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={settings.pageSettings.description}
              onChange={(e) => updateSettings({
                pageSettings: { ...settings.pageSettings, description: e.target.value }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              CTA Button Text
            </label>
            <input
              type="text"
              value={settings.pageSettings.ctaText}
              onChange={(e) => updateSettings({
                pageSettings: { ...settings.pageSettings, ctaText: e.target.value }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
            />
          </div>
        </div>
      </div>

      {/* Package Management */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Package Management</h2>
          <button
            type="button"
            onClick={addPackage}
            className="btn btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </button>
        </div>

        <div className="space-y-6">
          {settings.packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              layout
              className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    type="button"
                    onClick={() => updatePackage(pkg.id, { recommended: !pkg.recommended })}
                    className={`btn-icon ${pkg.recommended ? 'text-yellow-400' : 'text-gray-400'}`}
                    title={pkg.recommended ? 'Remove recommendation' : 'Mark as recommended'}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removePackage(pkg.id)}
                    className="btn-icon text-red-400"
                    title="Delete package"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (SGD)
                  </label>
                  <input
                    type="number"
                    value={pkg.price}
                    onChange={(e) => updatePackage(pkg.id, { price: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Service Visits
                  </label>
                  <input
                    type="number"
                    value={pkg.visits}
                    onChange={(e) => updatePackage(pkg.id, { visits: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={pkg.order}
                    onChange={(e) => updatePackage(pkg.id, { order: Number(e.target.value) })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Features (one per line)
                </label>
                <textarea
                  value={pkg.features.join('\n')}
                  onChange={(e) => updatePackage(pkg.id, {
                    features: e.target.value.split('\n').filter(Boolean)
                  })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
                />
              </div>

              {/* Acuity Mapping */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <AMCPackageMapping
                  package={pkg}
                  onSave={async (packageId, acuityTypeId) => {
                    updatePackage(packageId, { acuityAppointmentTypeId: acuityTypeId });
                  }}
                />
              </div>

              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id={`active-${pkg.id}`}
                  checked={pkg.active}
                  onChange={(e) => updatePackage(pkg.id, { active: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
                />
                <label htmlFor={`active-${pkg.id}`} className="ml-2 text-sm text-gray-300">
                  Package Active
                </label>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coverage Configuration */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Coverage Configuration</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Included Services (one per line)
            </label>
            <textarea
              value={settings.coverage.includedServices.join('\n')}
              onChange={(e) => updateSettings({
                coverage: {
                  ...settings.coverage,
                  includedServices: e.target.value.split('\n').filter(Boolean)
                }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Service Limitations (one per line)
            </label>
            <textarea
              value={settings.coverage.limitations.join('\n')}
              onChange={(e) => updateSettings({
                coverage: {
                  ...settings.coverage,
                  limitations: e.target.value.split('\n').filter(Boolean)
                }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Coverage Exclusions (one per line)
            </label>
            <textarea
              value={settings.coverage.exclusions.join('\n')}
              onChange={(e) => updateSettings({
                coverage: {
                  ...settings.coverage,
                  exclusions: e.target.value.split('\n').filter(Boolean)
                }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-32"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Response Time
              </label>
              <input
                type="text"
                value={settings.coverage.responseTime}
                onChange={(e) => updateSettings({
                  coverage: {
                    ...settings.coverage,
                    responseTime: e.target.value
                  }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Service Frequency
              </label>
              <select
                value={settings.coverage.schedule.frequency}
                onChange={(e) => updateSettings({
                  coverage: {
                    ...settings.coverage,
                    schedule: {
                      ...settings.coverage.schedule,
                      frequency: e.target.value as AMCPackageConfig['coverage']['schedule']['frequency']
                    }
                  }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              >
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Terms & Conditions</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={settings.termsAndConditions.content}
              onChange={(e) => updateSettings({
                termsAndConditions: {
                  ...settings.termsAndConditions,
                  content: e.target.value
                }
              })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Version
              </label>
              <input
                type="text"
                value={settings.termsAndConditions.version}
                onChange={(e) => updateSettings({
                  termsAndConditions: {
                    ...settings.termsAndConditions,
                    version: e.target.value
                  }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={settings.termsAndConditions.effectiveDate.split('T')[0]}
                onChange={(e) => updateSettings({
                  termsAndConditions: {
                    ...settings.termsAndConditions,
                    effectiveDate: new Date(e.target.value).toISOString()
                  }
                })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-5 w-5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AMCPackageSettings;