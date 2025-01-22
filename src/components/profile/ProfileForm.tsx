import React, { useState } from 'react';
import { Mail, Phone, Loader2, Save, X, User, MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import type {
  ProfileFormProps,
  ProfileFormData,
  ProfileFormErrors
} from '@/types/profile-form';
import { profileFormSchema } from '@/types/profile-form';

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    unitNumber: user.unitNumber || '',
    phone: user.phone || '',
    address: user.address || '',
    condoName: user.condoName || '',
    lobbyTower: user.lobbyTower || ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<ProfileFormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = profileFormSchema.parse(formData);
      setErrors({});
      setLoading(true);
      await onSave(validatedData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: ProfileFormErrors = {};
        err.errors.forEach(error => {
          const path = error.path[0];
          if (path && typeof path === 'string') {
            newErrors[path as keyof ProfileFormData] = error.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-gray-700 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-1.5";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400";
  const errorClasses = "mt-1.5 text-sm text-red-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Contact Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> Email
            </label>
            <div className="relative">
              <Mail className={iconClasses} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            {errors.email && <p className={errorClasses}>{errors.email}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> Mobile Number
            </label>
            <div className="relative">
              <Phone className={iconClasses} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> First Name
            </label>
            <div className="relative">
              <User className={iconClasses} />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            {errors.firstName && <p className={errorClasses}>{errors.firstName}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> Last Name
            </label>
            <div className="relative">
              <User className={iconClasses} />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className={`${inputClasses} pl-10`}
                required
              />
            </div>
            {errors.lastName && <p className={errorClasses}>{errors.lastName}</p>}
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Address Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> Unit Number
            </label>
            <div className="relative">
              <Building className={iconClasses} />
              <input
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                className={`${inputClasses} pl-10`}
                placeholder="#01-23"
                required
              />
            </div>
            {errors.unitNumber && <p className={errorClasses}>{errors.unitNumber}</p>}
          </div>

          <div>
            <label className={labelClasses}>
              <span className="text-red-400">*</span> Block/Number with Street Address
            </label>
            <div className="relative">
              <MapPin className={iconClasses} />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`${inputClasses} pl-10`}
                placeholder="e.g., Block 123 Example Street"
                required
              />
            </div>
            {errors.address && <p className={errorClasses}>{errors.address}</p>}
          </div>

          <div>
            <label className={labelClasses}>Condo Name</label>
            <div className="relative">
              <Building className={iconClasses} />
              <input
                type="text"
                value={formData.condoName}
                onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
                className={`${inputClasses} pl-10`}
                placeholder="e.g., Example Gardens"
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Lobby/Tower</label>
            <div className="relative">
              <Building className={iconClasses} />
              <input
                type="text"
                value={formData.lobbyTower}
                onChange={(e) => setFormData({ ...formData, lobbyTower: e.target.value })}
                className={`${inputClasses} pl-10`}
                placeholder="e.g., Tower A"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center px-6 py-2.5 border border-gray-600 rounded-lg text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          disabled={loading}
        >
          <X className="h-5 w-5 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg text-gray-900 font-medium hover:from-[#FFE44D] hover:to-[#FFB732] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-[#FFD700] transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;