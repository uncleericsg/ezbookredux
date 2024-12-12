import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast group-[.toaster]:bg-gray-800 group-[.toaster]:text-gray-200 group-[.toaster]:border-gray-700 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-400',
          actionButton: 'group-[.toast]:bg-gray-700 group-[.toast]:text-gray-200',
          cancelButton: 'group-[.toast]:bg-gray-600 group-[.toast]:text-gray-200',
        },
      }}
    />
  );
}

export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const options = {
    success: { icon: '✓', className: 'border-green-500/20 bg-green-500/10' },
    error: { icon: '✕', className: 'border-red-500/20 bg-red-500/10' },
    info: { icon: 'ℹ', className: 'border-blue-500/20 bg-blue-500/10' },
  };

  return Sonner.custom((id) => (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${options[type].className}`}
    >
      <span className="text-lg">{options[type].icon}</span>
      <p className="text-sm">{message}</p>
    </div>
  ));
}
