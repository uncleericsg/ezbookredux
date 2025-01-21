import type { FC } from 'react';
import { FiCheckSquare } from 'react-icons/fi';

interface TermsAndConditionsProps {
  isAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
}

export const TermsAndConditions: FC<TermsAndConditionsProps> = ({
  isAccepted,
  onAcceptChange,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onAcceptChange(!isAccepted)}
            className="mt-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-[#D4B86A] rounded"
          >
            <FiCheckSquare
              className={`h-5 w-5 ${
                isAccepted ? 'text-[#D4B86A]' : 'text-gray-400'
              }`}
            />
          </button>
          <div className="text-sm text-gray-300">
            <p>
              By proceeding with the payment, I agree to the{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4B86A] hover:underline"
              >
                Terms of Service
              </a>
              {' '}and{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4B86A] hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>
            <p className="mt-2 text-gray-400">
              I understand that my booking is subject to availability and confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

TermsAndConditions.displayName = 'TermsAndConditions';

export default TermsAndConditions;
