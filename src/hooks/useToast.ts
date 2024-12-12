import { toast } from 'sonner';

export const useToast = () => {
  return {
    showSuccess: (message: string) => toast.success(message),
    showError: (message: string) => toast.error(message),
    showWarning: (message: string) => toast.warning(message),
  };
};