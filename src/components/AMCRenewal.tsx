import React from 'react';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';
import type { AMCPackage } from '../types';

interface AMCRenewalProps {
  packages: AMCPackage[];
  onSelect: (packageId: string) => Promise<void>;
  loading?: boolean;
  selectedPackageId?: string;
}

const AMCRenewal: React.FC<AMCRenewalProps> = ({
  packages,
  onSelect,
  loading,
  selectedPackageId,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800 rounded-lg p-6 border border-gray-700 h-[28rem]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const isSelected = selectedPackageId === pkg.id;
        const isProcessing = isSelected && loading;

        return (
          <div
            key={pkg.id}
            className={`
              relative bg-gray-800 rounded-lg p-6 border
              ${pkg.recommended
                ? 'border-blue-500 bg-blue-500/5'
                : 'border-gray-700'
              }
            `}
          >
            {pkg.recommended && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
                Recommended
              </span>
            )}

            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold">${pkg.price}</span>
              <span className="text-gray-400">/year</span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">{pkg.visits} Service Visits</span>
              </li>
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelect(pkg.id)}
              disabled={loading}
              className={`
                w-full btn
                ${pkg.recommended ? 'btn-primary' : 'btn-secondary'}
                flex items-center justify-center space-x-2
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                'Select Plan'
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default AMCRenewal;