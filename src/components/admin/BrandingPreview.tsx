import { AirVent } from 'lucide-react';
import React from 'react';

interface BrandingPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  logo: string | null;
}

const BrandingPreview: React.FC<BrandingPreviewProps> = ({
  primaryColor,
  secondaryColor,
  logo,
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Preview</h3>
      
      <div className="space-y-4">
        {/* Header Preview */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            {logo ? (
              <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
            ) : (
              <AirVent className="h-8 w-8" style={{ color: primaryColor }} />
            )}
            <span className="text-xl font-bold">iAircon Easy Booking</span>
          </div>
        </div>

        {/* Button Previews */}
        <div className="space-y-2">
          <button
            className="w-full px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: primaryColor }}
          >
            Primary Button
          </button>
          <button
            className="w-full px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: secondaryColor }}
          >
            Secondary Button
          </button>
        </div>

        {/* Card Preview */}
        <div className="bg-gray-900 p-4 rounded-lg border" style={{ borderColor: primaryColor }}>
          <h4 className="font-medium mb-2" style={{ color: primaryColor }}>
            Sample Card
          </h4>
          <p className="text-sm text-gray-400">
            Preview how cards and content will appear with the selected colors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandingPreview;