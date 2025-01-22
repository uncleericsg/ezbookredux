import React, { useState, useCallback } from 'react';
import {
  Plus,
  HomeIcon,
  StarIcon,
  Loader2,
  Trash2,
  Save,
  X,
  BuildingIcon
} from 'lucide-react';

// Alias icons for semantic usage
const MapPinIcon = HomeIcon;
import { motion, AnimatePresence, type MotionProps } from 'framer-motion';
import { toast } from 'sonner';
import { z } from 'zod';
import type {
  Address,
  AddressFormData,
  AddressFormErrors,
  AddressManagerProps
} from '@/types/address-manager';
import {
  addressFormSchema,
  initialAddressFormData
} from '@/types/address-manager';

const AddressManager: React.FC<AddressManagerProps> = ({ onAddressChange, className }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialAddressFormData);
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const updateAddresses = useCallback((newAddresses: Address[]) => {
    setAddresses(newAddresses);
    onAddressChange?.(newAddresses);
  }, [onAddressChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = addressFormSchema.parse(formData);
      setErrors({});
      setLoading(true);

      const newAddress: Address = {
        id: editingId || Date.now().toString(),
        ...validatedData,
        isPrimary: addresses.length === 0
      };

      if (editingId) {
        updateAddresses(addresses.map(addr => 
          addr.id === editingId ? newAddress : addr
        ));
        toast.success('Address updated successfully');
      } else {
        updateAddresses([...addresses, newAddress]);
        toast.success('Address added successfully');
      }

      setShowAddForm(false);
      setEditingId(null);
      setFormData(initialAddressFormData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: AddressFormErrors = {};
        err.errors.forEach(error => {
          const path = error.path[0];
          if (path && typeof path === 'string') {
            newErrors[path as keyof AddressFormData] = error.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = useCallback((address: Address) => {
    setFormData({
      address: address.address,
      unitNumber: address.unitNumber,
      postalCode: address.postalCode,
      condoName: address.condoName || '',
      lobbyTower: address.lobbyTower || ''
    });
    setEditingId(address.id);
    setShowAddForm(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const address = addresses.find(a => a.id === id);
    if (address?.isPrimary) {
      toast.error('Cannot delete primary address');
      return;
    }

    const newAddresses = addresses.filter(a => a.id !== id);
    updateAddresses(newAddresses);
    toast.success('Address deleted successfully');
  }, [addresses, updateAddresses]);

  const setPrimaryAddress = useCallback(async (id: string) => {
    const newAddresses = addresses.map(addr => ({
      ...addr,
      isPrimary: addr.id === id
    }));
    updateAddresses(newAddresses);
    toast.success('Primary address updated');
  }, [addresses, updateAddresses]);

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Addresses</h2>
        <button
          onClick={() => {
            setShowAddForm(true);
            setEditingId(null);
            setFormData(initialAddressFormData);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg text-gray-900 font-medium hover:from-[#FFE44D] hover:to-[#FFB732] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-all"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Address
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-gray-700/50 rounded-lg p-6 border border-gray-600"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="text-red-400">*</span> Unit Number
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.unitNumber}
                      onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                      placeholder="e.g., #01-23"
                      required
                    />
                  </div>
                  {errors.unitNumber && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.unitNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="text-red-400">*</span> Block/Number with Street Address
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                      placeholder="e.g., Block 123 Example Street"
                      required
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    <span className="text-red-400">*</span> Postal Code
                  </label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                      placeholder="6-digit postal code"
                      maxLength={6}
                      required
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="mt-1.5 text-sm text-red-400">{errors.postalCode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Condo Name
                  </label>
                  <div className="relative">
                    <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.condoName}
                      onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                      placeholder="e.g., Example Gardens"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Lobby/Tower
                  </label>
                  <div className="relative">
                    <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lobbyTower}
                      onChange={(e) => setFormData({ ...formData, lobbyTower: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors"
                      placeholder="e.g., Tower A"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-600">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-600 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg text-gray-900 font-medium hover:from-[#FFE44D] hover:to-[#FFB732] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      {editingId ? 'Update' : 'Add'} Address
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No addresses added yet
          </div>
        ) : (
          addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{address.address}</h3>
                      {address.isPrimary && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/20">
                          Primary
                        </span>
                      )}
                    </div>
                    {address.condoName && (
                      <p className="text-sm text-gray-400 mt-1">Condo: {address.condoName}</p>
                    )}
                    {address.lobbyTower && (
                      <p className="text-sm text-gray-400 mt-1">Tower: {address.lobbyTower}</p>
                    )}
                    {address.unitNumber && (
                      <p className="text-sm text-gray-400 mt-1">Unit: {address.unitNumber}</p>
                    )}
                    <p className="text-sm text-gray-400">Postal Code: {address.postalCode}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!address.isPrimary && (
                    <button
                      onClick={() => setPrimaryAddress(address.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-yellow-400 hover:bg-yellow-400/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400 transition-colors"
                      title="Set as primary"
                    >
                      <StarIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-colors"
                    title="Edit address"
                  >
                    Edit
                  </button>
                  {!address.isPrimary && (
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:bg-red-400/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-400 transition-colors"
                      title="Delete address"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressManager;