import { useMutation } from '@tanstack/react-query';
import { changePassword } from '@/api/auth.api';
import type { ApiError } from '@/api/apiError';
import { toast } from 'sonner';

export function useChangePassword() {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePassword(currentPassword, newPassword),
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
}