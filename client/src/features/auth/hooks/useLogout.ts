import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { logout as logoutAPI } from '@/api/auth';
import { useAuthStore } from '@/shared/stores/authStore';

export function useLogout() {
  const navigate = useNavigate();
  const { logout: logoutStore } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call logout API
      const response = await logoutAPI();

      if (response.success) {
        // Clear auth state
        logoutStore();

        // Redirect to sign in
        navigate({ to: '/sign_in' });
      } else {
        setError(response.message || 'Failed to logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
      setError('An error occurred during logout');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, logoutStore]);

  return { logout, isLoading, error };
}
