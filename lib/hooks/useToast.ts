import { useToastStore } from '@/lib/store/toast-store';

export function useToast() {
  const { addToast, success, error, info, warning } = useToastStore();

  return {
    toast: addToast,
    success,
    error,
    info,
    warning,
  };
}