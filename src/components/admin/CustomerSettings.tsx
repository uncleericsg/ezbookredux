'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Save, Loader2, User, Mail, Phone, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@utils/cn';

export interface CustomerConfig;

export interface CustomerSettingsProps;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CustomerConfig {
  registration: {
    requireEmail: boolean;
    requirePhone: boolean;
    requireAddress: boolean;
    verifyEmail: boolean;
    verifyPhone: boolean;
  };
  preferences: {
    allowNotifications: boolean;
    allowMarketing: boolean;
    allowSMS: boolean;
    allowWhatsApp: boolean;
  };
  privacy: {
    dataRetentionDays: number;
    anonymizeInactive: boolean;
    inactivePeriodDays: number;
    gdprCompliance: boolean;
  };
  loyalty: {
    enabled: boolean;
    pointsPerBooking: number;
    pointsPerDollar: number;
    minimumPointsRedemption: number;
  };
}

const defaultConfig: CustomerConfig = {
  registration: {
    requireEmail: true,
    requirePhone: true,
    requireAddress: false,
    verifyEmail: true,
    verifyPhone: false,
  },
  preferences: {
    allowNotifications: true,
    allowMarketing: false,
    allowSMS: true,
    allowWhatsApp: true,
  },
  privacy: {
    dataRetentionDays: 365,
    anonymizeInactive: true,
    inactivePeriodDays: 730,
    gdprCompliance: true,
  },
  loyalty: {
    enabled: true,
    pointsPerBooking: 100,
    pointsPerDollar: 1,
    minimumPointsRedemption: 1000,
  },
};

const CustomerSettings = () => {
  const [config, setConfig] = useState(defaultConfig);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1000);
      });
      toast.success('Customer settings saved successfully');
    } catch (error) {
      toast.error('Failed to save customer settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    toast.success('Settings reset to default');
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Customer Settings
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-700 bg-gray-800 p-6"
      >
        <div className="mb-6">
          <h2 className="flex items-center text-xl font-semibold">
            <User className="mr-2 h-5 w-5" />
            Registration Requirements
          </h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.registration.requireEmail}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      registration: {
                        ...config.registration,
                        requireEmail: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Require Email</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.registration.requirePhone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      registration: {
                        ...config.registration,
                        requirePhone: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Require Phone</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.registration.requireAddress}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      registration: {
                        ...config.registration,
                        requireAddress: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Require Address</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.registration.verifyEmail}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      registration: {
                        ...config.registration,
                        verifyEmail: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Verify Email</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.registration.verifyPhone}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      registration: {
                        ...config.registration,
                        verifyPhone: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Verify Phone</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="flex items-center text-xl font-semibold">
            <Mail className="mr-2 h-5 w-5" />
            Communication Preferences
          </h2>
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.preferences.allowNotifications}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        allowNotifications: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow Notifications</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.preferences.allowMarketing}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        allowMarketing: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow Marketing</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.preferences.allowSMS}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        allowSMS: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow SMS</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.preferences.allowWhatsApp}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        allowWhatsApp: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow WhatsApp</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="flex items-center text-xl font-semibold">
            <Shield className="mr-2 h-5 w-5" />
            Privacy Settings
          </h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Data Retention Period (days)
              </label>
              <input
                type="number"
                min="30"
                value={config.privacy.dataRetentionDays}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    privacy: {
                      ...config.privacy,
                      dataRetentionDays: parseInt(e.target.value, 10),
                    },
                  })
                }
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                  'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                )}
              />
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.privacy.anonymizeInactive}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    privacy: {
                      ...config.privacy,
                      anonymizeInactive: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Anonymize Inactive Users</span>
            </label>
            {config.privacy.anonymizeInactive && (
              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Inactive Period (days)
                </label>
                <input
                  type="number"
                  min="30"
                  value={config.privacy.inactivePeriodDays}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      privacy: {
                        ...config.privacy,
                        inactivePeriodDays: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className={cn(
                    'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                    'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                  )}
                />
              </div>
            )}
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={config.privacy.gdprCompliance}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    privacy: {
                      ...config.privacy,
                      gdprCompliance: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Enable GDPR Compliance</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="flex items-center text-xl font-semibold">
            <Phone className="mr-2 h-5 w-5" />
            Loyalty Program
          </h2>
          <div className="mt-4 space-y-4">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={config.loyalty.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    loyalty: {
                      ...config.loyalty,
                      enabled: e.target.checked,
                    },
                  })
                }
                className="peer sr-only"
              />
              <div
                className={cn(
                  'h-6 w-11 rounded-full bg-gray-600 transition-colors',
                  'after:absolute after:left-[2px] after:top-[2px]',
                  'after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all',
                  'peer-checked:bg-blue-500 peer-checked:after:translate-x-full',
                  'peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500'
                )}
              />
              <span className="ml-3 text-sm font-medium text-gray-300">Enable Loyalty Program</span>
            </label>
            {config.loyalty.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Points Per Booking
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={config.loyalty.pointsPerBooking}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        loyalty: {
                          ...config.loyalty,
                          pointsPerBooking: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                      'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Points Per Dollar Spent
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={config.loyalty.pointsPerDollar}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        loyalty: {
                          ...config.loyalty,
                          pointsPerDollar: parseFloat(e.target.value),
                        },
                      })
                    }
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                      'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Minimum Points for Redemption
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={config.loyalty.minimumPointsRedemption}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        loyalty: {
                          ...config.loyalty,
                          minimumPointsRedemption: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                      'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            onClick={handleReset}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium',
              'bg-gray-700 text-gray-100 transition-colors',
              'hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
            )}
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className={cn(
              'inline-flex items-center rounded-md px-4 py-2',
              'bg-blue-500 text-white transition-colors',
              'hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </Box>
  );
};

CustomerSettings.displayName = 'CustomerSettings';

undefined.displayName = 'undefined';