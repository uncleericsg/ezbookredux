import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineHome } from 'react-icons/hi2';
import type { CustomerInfo } from '@/types/customer';
import type { BaseStepProps } from '@/types/booking-flow';
import type { DBCustomerFormData } from '@/types/customer-form';
import { customerFormSchema } from '@/types/customer-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const CustomerStep: React.FC<BaseStepProps> = ({
  onNext,
  onBack,
  bookingData,
  onUpdateBookingData,
  className
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<DBCustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      first_name: bookingData.customerInfo.firstName,
      last_name: bookingData.customerInfo.lastName,
      email: bookingData.customerInfo.email,
      mobile: bookingData.customerInfo.phone,
      floor_unit: bookingData.customerInfo.address.floorUnit || null,
      block_street: bookingData.customerInfo.address.blockStreet,
      postal_code: bookingData.customerInfo.address.postalCode,
      condo_name: bookingData.customerInfo.address.condoName || null,
      lobby_tower: bookingData.customerInfo.address.lobbyTower || null,
      special_instructions: bookingData.customerInfo.specialInstructions || null
    }
  });

  const onSubmit = async (data: DBCustomerFormData) => {
    try {
      const customerInfo: CustomerInfo = {
        id: bookingData.customerInfo.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        phone: data.mobile,
        address: {
          floorUnit: data.floor_unit || undefined,
          blockStreet: data.block_street,
          postalCode: data.postal_code,
          condoName: data.condo_name || undefined,
          lobbyTower: data.lobby_tower || undefined,
          region: bookingData.customerInfo.address.region
        },
        specialInstructions: data.special_instructions || undefined
      };

      onUpdateBookingData({
        ...bookingData,
        customerInfo
      });
      onNext();
    } catch (error) {
      toast.error('Failed to save customer information');
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Personal Information
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                First Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('first_name')}
                  className="pl-10"
                  placeholder="Enter your first name"
                  error={errors.first_name?.message}
                />
              </div>
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Last Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('last_name')}
                  className="pl-10"
                  placeholder="Enter your last name"
                  error={errors.last_name?.message}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('email')}
                  type="email"
                  className="pl-10"
                  placeholder="Enter your email"
                  error={errors.email?.message}
                />
              </div>
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Mobile Number
              </label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('mobile')}
                  type="tel"
                  className="pl-10"
                  placeholder="Enter your mobile number"
                  error={errors.mobile?.message}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-800/90 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Service Address
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Block/Street */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Block/Street
              </label>
              <div className="relative">
                <HiOutlineHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  {...register('block_street')}
                  className="pl-10"
                  placeholder="Enter block and street"
                  error={errors.block_street?.message}
                />
              </div>
            </div>

            {/* Floor/Unit */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Floor/Unit (Optional)
              </label>
              <Input
                {...register('floor_unit')}
                placeholder="Enter floor and unit number"
                error={errors.floor_unit?.message}
              />
            </div>

            {/* Postal Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Postal Code
              </label>
              <Input
                {...register('postal_code')}
                placeholder="Enter postal code"
                error={errors.postal_code?.message}
              />
            </div>

            {/* Condo Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Condo Name (Optional)
              </label>
              <Input
                {...register('condo_name')}
                placeholder="Enter condominium name"
                error={errors.condo_name?.message}
              />
            </div>

            {/* Lobby/Tower */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Lobby/Tower (Optional)
              </label>
              <Input
                {...register('lobby_tower')}
                placeholder="Enter lobby or tower number"
                error={errors.lobby_tower?.message}
              />
            </div>

            {/* Special Instructions */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">
                Special Instructions (Optional)
              </label>
              <Textarea
                {...register('special_instructions')}
                placeholder="Enter any special instructions for the technician"
                error={errors.special_instructions?.message}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerStep;
