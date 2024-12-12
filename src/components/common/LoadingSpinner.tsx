import { Loader2 } from 'lucide-react';

/**
 * @deprecated Use the Spinner component from @/components/ui/spinner instead.
 * This component will be removed in a future release.
 */
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * @deprecated Use the Spinner component from @/components/ui/spinner instead.
 * This component will be removed in a future release.
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  console.warn('LoadingSpinner is deprecated. Use Spinner from @/components/ui/spinner instead.');
  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Loader2 
        className={`animate-spin text-blue-500 ${sizeMap[size]} ${className}`}
      />
    </div>
  );
}

/**
 * @deprecated Use the Spinner component from @/components/ui/spinner instead.
 * This component will be removed in a future release.
 */
export function FullPageLoader() {
  console.warn('FullPageLoader is deprecated. Use Spinner from @/components/ui/spinner instead.');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="rounded-lg bg-white/10 p-8 shadow-xl">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-center text-sm text-gray-200">Loading...</p>
      </div>
    </div>
  );
}
