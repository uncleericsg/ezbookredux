import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlinePhone, HiOutlineHome } from 'react-icons/hi2';
import * as z from 'zod';
import type { CreateBookingParams } from '@shared/types/booking';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

const customerSchema = z.object({
  first_name: z.string().min(2, 'First name is required'),
  last_name: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(8, 'Valid phone number is required'),
  floor_unit: z.string().optional(),
  block_street: z.string().min(5, 'Address is required'),
  postal_code: z.string().min(6, 'Valid postal code is required'),
  condo_name: z.string().optional(),
  lobby_tower: z.string().optional(),
  special_instructions: z.string().optional()
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerStepProps {
  onNext: () => void;
  onBack: () => void;
  bookingData: Partial<CreateBookingParams>;
  onUpdateBookingData: (data: Partial<CreateBookingParams>) => void;
  className?: string;
}

const CustomerStep: React.FC<CustomerStepProps> = ({
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
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: bookingData.customer_first_name || '',
      last_name: bookingData.customer_last_name || '',
      email: bookingData.customer_email || '',
      mobile: bookingData.customer_mobile || '',
      floor_unit: bookingData.floor_unit || '',
      block_street: bookingData.block_street || '',
      postal_code: bookingData.postal_code || '',
      condo_name: bookingData.condo_name || '',
      lobby_tower: bookingData.lobby_tower || '',
      special_instructions: bookingData.special_instructions || ''
    }
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      onUpdateBookingData({
        ...bookingData,
        customer_first_name: data.first_name,
        customer_last_name: data.last_name,
        customer_email: data.email,
        customer_mobile: data.mobile,
        floor_unit: data.floor_unit,
        block_street: data.block_street,
        postal_code: data.postal_code,
        condo_name: data.condo_name,
        lobby_tower: data.lobby_tower,
        special_instructions: data.special_instructions
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

CustomerStep.displayName = 'CustomerStep';

export default CustomerStep; 