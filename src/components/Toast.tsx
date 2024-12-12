import { Toaster } from 'sonner';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1F2937',
          color: '#F3F4F6',
          border: '1px solid #374151',
        },
        success: {
          icon: '✓',
          className: '!bg-green-500/10 !border-green-500/20',
        },
        error: {
          icon: '✕',
          className: '!bg-red-500/10 !border-red-500/20',
        },
        warning: {
          icon: '⚠',
          className: '!bg-yellow-500/10 !border-yellow-500/20',
        },
      }}
    />
  );
};

export default Toast;