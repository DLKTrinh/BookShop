import { useMutation } from '@tanstack/react-query';
import { register } from '@/api/auth.api';
import type { ApiError } from '@/api/apiError';
import { toast } from 'sonner';

export function useRegister() {
  return useMutation({
    mutationFn: ({
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    }) => register(username, email, password),
    onError: (error: ApiError) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}