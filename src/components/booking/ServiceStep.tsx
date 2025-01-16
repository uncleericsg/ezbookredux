import React from 'react';
import { toast } from 'sonner';
import { HiOutlineWrenchScrewdriver, HiOutlineClock, HiOutlineCurrencyDollar } from 'react-icons/hi2';
import type { CreateBookingParams } from '@shared/types/booking';
import { formatPrice } from '@/utils/formatters';

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  isPopular?: boolean;
}

interface ServiceStepProps {
  onNext: () => void;
  onBack: () => void;
  bookingData: Partial<CreateBookingParams>;
  onUpdateBookingData: (data: Partial<CreateBookingParams>) => void;
  className?: string;
}

const AVAILABLE_SERVICES: ServiceOption[] = [
  {
    id: 'basic-service',
    title: 'Basic Service',
    description: 'Standard maintenance and repair service for your appliances',
    price: 89,
    duration: 60,
  },
  {
    id: 'comprehensive-service',
    title: 'Comprehensive Service',
    description: 'Detailed inspection and maintenance with advanced diagnostics',
    price: 149,
    duration: 90,
    isPopular: true,
  },
  {
    id: 'premium-service',
    title: 'Premium Service',
    description: 'Complete system overhaul with preventive maintenance',
    price: 249,
    duration: 120,
  },
];

const ServiceStep: React.FC<ServiceStepProps> = ({
  onNext,
  onBack,
  bookingData,
  onUpdateBookingData,
  className
}) => {
  const handleServiceSelect = (service: ServiceOption) => {
    onUpdateBookingData({
      ...bookingData,
      service_id: service.id,
      service_title: service.title,
      service_description: service.description,
      service_price: service.price,
      service_duration: service.duration
    });
    onNext();
  };

  return (
    <div className={className}>
      <div className="space-y-8">
        {/* Service Options */}
        <div className="grid gap-6 md:grid-cols-3">
          {AVAILABLE_SERVICES.map((service) => (
            <div
              key={service.id}
              className={`relative bg-gray-800/90 rounded-lg p-6 cursor-pointer hover:bg-gray-700/90 transition-colors
                ${bookingData.service_id === service.id ? 'ring-2 ring-yellow-500' : ''}
              `}
              onClick={() => handleServiceSelect(service)}
            >
              {service.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-black text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Service Title */}
                <div className="flex items-center space-x-2">
                  <HiOutlineWrenchScrewdriver className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-white">
                    {service.title}
                  </h3>
                </div>

                {/* Service Description */}
                <p className="text-gray-300 text-sm">
                  {service.description}
                </p>

                {/* Service Details */}
                <div className="space-y-2">
                  {/* Duration */}
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <HiOutlineClock className="w-4 h-4" />
                    <span>{service.duration} minutes</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <HiOutlineCurrencyDollar className="w-4 h-4" />
                    <span>{formatPrice(service.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4">
          <button
            onClick={onBack}
            className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              if (!bookingData.service_id) {
                toast.error('Please select a service to continue');
                return;
              }
              onNext();
            }}
            className="px-6 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

ServiceStep.displayName = 'ServiceStep';

export default ServiceStep; 