import React from 'react';
import { format } from 'date-fns';
import { FiClock, FiDollarSign, FiMapPin, FiUser } from 'react-icons/fi';
import { cn } from '@utils/cn';

interface BookingSummaryProps {
  data: {
    service_title: string;
    service_price: number;
    service_duration: string;
    customer_info: {
      first_name: string;
      last_name: string;
      email: string;
      mobile: string;
      floor_unit: string;
      block_street: string;
      postal_code: string;
      condo_name?: string;
      lobby_tower?: string;
      special_instructions?: string;
    };
    scheduled_datetime: Date;
    scheduled_timeslot: string;
    total_amount: number;
    tip_amount: number;
  };
  className?: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  data,
  className
}) => {
  const {
    service_title,
    service_price,
    service_duration,
    customer_info,
    scheduled_datetime,
    scheduled_timeslot,
    total_amount,
    tip_amount
  } = data;

  return (
    <div className={cn('space-y-6 rounded-lg bg-white p-6 shadow-sm', className)}>
      {/* Service Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{service_title}</h3>
        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FiClock className="mr-1 h-4 w-4" />
            <span>{service_duration}</span>
          </div>
          <div className="flex items-center">
            <FiDollarSign className="mr-1 h-4 w-4" />
            <span>${service_price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h4 className="font-medium text-gray-900">Appointment Time</h4>
        <div className="mt-1 text-sm text-gray-500">
          <p>{format(scheduled_datetime, 'EEEE, MMMM d, yyyy')}</p>
          <p>{scheduled_timeslot}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div>
        <h4 className="flex items-center font-medium text-gray-900">
          <FiUser className="mr-2 h-4 w-4" />
          Customer Details
        </h4>
        <div className="mt-1 text-sm text-gray-500">
          <p>{`${customer_info.first_name} ${customer_info.last_name}`}</p>
          <p>{customer_info.email}</p>
          <p>{customer_info.mobile}</p>
        </div>
      </div>

      {/* Service Address */}
      <div>
        <h4 className="flex items-center font-medium text-gray-900">
          <FiMapPin className="mr-2 h-4 w-4" />
          Service Address
        </h4>
        <div className="mt-1 text-sm text-gray-500">
          <p>{customer_info.block_street}</p>
          {customer_info.floor_unit && <p>Unit: {customer_info.floor_unit}</p>}
          {customer_info.condo_name && <p>{customer_info.condo_name}</p>}
          {customer_info.lobby_tower && <p>Tower: {customer_info.lobby_tower}</p>}
          <p>Singapore {customer_info.postal_code}</p>
        </div>
      </div>

      {/* Special Instructions */}
      {customer_info.special_instructions && (
        <div>
          <h4 className="font-medium text-gray-900">Special Instructions</h4>
          <p className="mt-1 text-sm text-gray-500">
            {customer_info.special_instructions}
          </p>
        </div>
      )}

      {/* Payment Summary */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900">Payment Summary</h4>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Service Fee</span>
            <span className="font-medium">${service_price.toFixed(2)}</span>
          </div>
          {tip_amount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tip</span>
              <span className="font-medium">${tip_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-medium">
            <span>Total</span>
            <span>${total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
