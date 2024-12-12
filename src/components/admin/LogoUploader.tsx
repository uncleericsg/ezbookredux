import React, { useState, useCallback } from 'react';
import { Upload, Image, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Dimensions {
  width: number;
  height: number;
}

interface LogoUploaderProps {
  type: 'website' | 'webapp' | 'favicon';
  currentLogo?: string;
  onUpload: (file: File) => Promise<void>;
  allowedTypes?: string[];
  maxSize?: number;
  minDimensions?: Dimensions;
  exactDimensions?: Dimensions;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ type, currentLogo, onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);

  const validateFile = (file: File): boolean => {
    const maxSizes = {
      website: 2 * 1024 * 1024, // 2MB
      webapp: 2 * 1024 * 1024,  // 2MB
      favicon: 1 * 1024 * 1024  // 1MB
    };

    const allowedTypes = {
      website: ['image/png', 'image/jpeg', 'image/svg+xml'],
      webapp: ['image/png', 'image/jpeg'],
      favicon: ['image/png', 'image/x-icon']
    };

    // Check file size
    if (file.size > maxSizes[type]) {
      toast.error(`File size exceeds ${maxSizes[type] / (1024 * 1024)}MB limit`);
      return false;
    }

    // Check file type
    if (!allowedTypes[type].includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${allowedTypes[type].join(', ')}`);
      return false;
    }

    // Check dimensions for webapp logo
    if (type === 'webapp') {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 512 || img.height < 512) {
            toast.error('Web app logo must be at least 512x512px');
            resolve(false);
          }
          resolve(true);
        };
        img.src = URL.createObjectURL(file);
      });
    }

    return true;
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (await validateFile(file)) {
      handleFileUpload(file);
    }
  }, [type]);

  const handleFileUpload = async (file: File) => {
    try {
      setLoading(true);

      // Generate preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Upload file
      await onUpload(file);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload logo');
      setPreview(currentLogo || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragging ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
        `}
      >
        <input
          type="file"
          accept={type === 'favicon' ? '.ico,.png' : '.jpg,.jpeg,.png,.svg'}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
          id={`logo-upload-${type}`}
        />

        <label
          htmlFor={`logo-upload-${type}`}
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <span className="text-sm text-gray-400">
            Drag and drop or click to upload
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {type === 'website' && 'PNG, JPG, or SVG (max 2MB)'}
            {type === 'webapp' && 'PNG or JPG, min 512x512px (max 2MB)'}
            {type === 'favicon' && 'PNG or ICO (max 1MB)'}
          </span>
        </label>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/75 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}
      </div>

      {preview && (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Preview</h4>
            {type === 'webapp' && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">Generated Sizes:</span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">512x512</span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">192x192</span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">180x180</span>
              </div>
            )}
          </div>
          <div className="relative aspect-square w-24 rounded overflow-hidden">
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUploader;