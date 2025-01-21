import type { FC } from 'react';
import { FiInfo } from 'react-icons/fi';

interface PaymentSummaryProps {
  serviceAmount: number;
  tipAmount: number;
  totalAmount: number;
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({
  serviceAmount,
  tipAmount,
  totalAmount,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-medium text-white flex items-center space-x-2">
        <FiInfo className="h-5 w-5 text-gray-400" />
        <span>Payment Summary</span>
      </h3>

      <div className="space-y-3">
        <div className="flex justify-between text-gray-300">
          <span>Service Amount</span>
          <span className="font-medium">{formatCurrency(serviceAmount)}</span>
        </div>

        {tipAmount > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Tip Amount</span>
            <span className="font-medium text-green-400">{formatCurrency(tipAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-gray-700">
          <div className="flex justify-between text-white">
            <span className="font-medium">Total Amount</span>
            <span className="font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>All prices are in Singapore Dollars (SGD)</p>
      </div>
    </div>
  );
};

PaymentSummary.displayName = 'PaymentSummary';

export default PaymentSummary;
