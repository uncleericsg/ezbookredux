'use client';

import { motion } from 'framer-motion';
import { Save, Loader2, Clock, Calendar, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@utils/cn';

export interface BookingConfig {
  allowedDaysInAdvance: number;
  minHoursBeforeBooking: number;
  maxBookingsPerDay: number;
  bufferBetweenBookings: number;
  workingHours: {
    start: string;
    end: string;
  };
  holidays: string[];
}

export interface BookingSettingsProps {
  config: BookingConfig;
  onSave: (config: BookingConfig) => void;
  loading?: boolean;
}

const defaultConfig: BookingConfig = {
  timeSlots: {
    enabled: true,
    duration: 60,
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 15,
  },
  scheduling: {
    minAdvanceBooking: 24,
    maxAdvanceBooking: 30,
    allowSameDay: false,
    allowWeekends: true,
  },
  capacity: {
    maxBookingsPerDay: 10,
    maxBookingsPerSlot: 2,
    overbookingBuffer: 1,
  },
  restrictions: {
    enabled: true,
    maxBookingsPerUser: 3,
    cancellationPeriod: 24,
    blackoutDates: [],
  },
};

const BookingSettings = ({
  settings,
  onUpdate,
}: BookingSettingsProps) => {
  const [config, setConfig] = useState<BookingConfig>(settings);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise((resolve) => {
        window.setTimeout(resolve, 1000);
      });
      onUpdate(config);
      toast.success('Booking settings saved successfully');
    } catch (error) {
      toast.error('Failed to save booking settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    toast.success('Settings reset to default');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Booking Settings
      </h2>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-700 bg-gray-800 p-6"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Time Slots</h2>
          <div className="mt-4 space-y-4">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={config.timeSlots.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    timeSlots: {
                      ...config.timeSlots,
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
              <span className="ml-3 text-sm font-medium text-gray-300">Enable Time Slots</span>
            </label>
            {config.timeSlots.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    <Clock className="mr-2 inline-block h-4 w-4" />
                    Slot Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="15"
                    step="15"
                    value={config.timeSlots.duration}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        timeSlots: {
                          ...config.timeSlots,
                          duration: parseInt(e.target.value, 10),
                        },
                      })
                    }
                    className={cn(
                      'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                      'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300">Start Time</label>
                    <input
                      type="time"
                      value={config.timeSlots.startTime}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          timeSlots: {
                            ...config.timeSlots,
                            startTime: e.target.value,
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
                    <label className="block text-sm font-medium text-gray-300">End Time</label>
                    <input
                      type="time"
                      value={config.timeSlots.endTime}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          timeSlots: {
                            ...config.timeSlots,
                            endTime: e.target.value,
                          },
                        })
                      }
                      className={cn(
                        'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                        'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                      )}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={config.timeSlots.breakDuration}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        timeSlots: {
                          ...config.timeSlots,
                          breakDuration: parseInt(e.target.value, 10),
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

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Scheduling</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                <Calendar className="mr-2 inline-block h-4 w-4" />
                Minimum Advance Booking (hours)
              </label>
              <input
                type="number"
                min="0"
                value={config.scheduling.minAdvanceBooking}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    scheduling: {
                      ...config.scheduling,
                      minAdvanceBooking: parseInt(e.target.value, 10),
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
                Maximum Advance Booking (days)
              </label>
              <input
                type="number"
                min="1"
                value={config.scheduling.maxAdvanceBooking}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    scheduling: {
                      ...config.scheduling,
                      maxAdvanceBooking: parseInt(e.target.value, 10),
                    },
                  })
                }
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                  'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                )}
              />
            </div>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.scheduling.allowSameDay}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      scheduling: {
                        ...config.scheduling,
                        allowSameDay: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow Same Day Bookings</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={config.scheduling.allowWeekends}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      scheduling: {
                        ...config.scheduling,
                        allowWeekends: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Allow Weekend Bookings</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Capacity</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                <Users className="mr-2 inline-block h-4 w-4" />
                Maximum Bookings Per Day
              </label>
              <input
                type="number"
                min="1"
                value={config.capacity.maxBookingsPerDay}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    capacity: {
                      ...config.capacity,
                      maxBookingsPerDay: parseInt(e.target.value, 10),
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
                Maximum Bookings Per Time Slot
              </label>
              <input
                type="number"
                min="1"
                value={config.capacity.maxBookingsPerSlot}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    capacity: {
                      ...config.capacity,
                      maxBookingsPerSlot: parseInt(e.target.value, 10),
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
              <label className="block text-sm font-medium text-gray-300">Overbooking Buffer</label>
              <input
                type="number"
                min="0"
                value={config.capacity.overbookingBuffer}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    capacity: {
                      ...config.capacity,
                      overbookingBuffer: parseInt(e.target.value, 10),
                    },
                  })
                }
                className={cn(
                  'mt-1 block w-full rounded-md border-gray-600 bg-gray-700 px-3 py-2',
                  'text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                )}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Restrictions</h2>
          <div className="mt-4 space-y-4">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={config.restrictions.enabled}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    restrictions: {
                      ...config.restrictions,
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
              <span className="ml-3 text-sm font-medium text-gray-300">Enable Restrictions</span>
            </label>
            {config.restrictions.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Maximum Bookings Per User
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={config.restrictions.maxBookingsPerUser}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        restrictions: {
                          ...config.restrictions,
                          maxBookingsPerUser: parseInt(e.target.value, 10),
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
                    Cancellation Period (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={config.restrictions.cancellationPeriod}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        restrictions: {
                          ...config.restrictions,
                          cancellationPeriod: parseInt(e.target.value, 10),
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
    </div>
  );
};

BookingSettings.displayName = 'BookingSettings';

export type { BookingConfig };
export { BookingSettings };

undefined.displayName = 'undefined';