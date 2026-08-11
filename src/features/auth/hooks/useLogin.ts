import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout } from '@/api/auth.api';
import type { ApiError } from '@/api/apiError';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onError: (error: ApiError) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuth();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear(); // drop cached books/etc. tied to the previous session
      toast.success('Logged out');
    },
    onError: (error: ApiError) => {
      // Clear client-side auth regardless — a failed logout call server-side
      // shouldn't leave the user stuck looking logged in.
      clearAuth();
      toast.error(error.message || 'Logout failed');
    },
  });
}