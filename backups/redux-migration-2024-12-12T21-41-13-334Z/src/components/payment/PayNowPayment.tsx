import React from 'react';
import { QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PayNowPaymentProps {
  amount: number;
  onSuccess: () => void;
  className?: string;
}

const PayNowPayment: React.FC<PayNowPaymentProps> = ({
  amount,
  onSuccess,
  className = '',
}) => {
  const [copied, setCopied] = React.useState(false);
  const uenNumber = '202012345K'; // Replace with your actual UEN

  const handleCopyUEN = () => {
    navigator.clipboard.writeText(uenNumber);
    setCopied(true);
    toast.success('UEN copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentVerification = () => {
    // In a real implementation, you would verify the payment with your backend
    // For now, we'll just simulate success
    onSuccess();
    toast.success('Payment verified successfully');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <QrCode className="h-48 w-48 text-gray-400" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Company UEN</p>
              <p className="font-mono font-medium">{uenNumber}</p>
            </div>
            <button
              onClick={handleCopyUEN}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          <div className="p-3 bg-gray-900 rounded-lg">
            <p className="text-sm text-gray-400">Amount to Pay</p>
            <p className="font-mono font-medium text-xl">
              ${amount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-400 text-center">
            After making the payment, click the button below to verify
          </p>
          <button
            onClick={handlePaymentVerification}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            I've Made the Payment
          </button>
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <QrCode className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-400">
              How to pay with PayNow
            </p>
            <ol className="text-sm text-gray-400 mt-2 list-decimal ml-4 space-y-1">
              <li>Open your bank's mobile app</li>
              <li>Scan the QR code or enter the UEN manually</li>
              <li>Enter the exact amount shown above</li>
              <li>Complete the payment in your bank's app</li>
              <li>Return here and click "I've Made the Payment"</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayNowPayment;
