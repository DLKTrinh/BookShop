import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '@/api/auth.api';
import type { ApiError } from '@/api/apiError';
import { toast } from 'sonner';

export function useDeleteAccount() {
  return useMutation({
    mutationFn: (password: string) => deleteAccount(password),
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
}